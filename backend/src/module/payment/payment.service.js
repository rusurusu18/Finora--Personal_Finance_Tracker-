import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import prisma from "../../config/database.js";
import { ApiError } from "../../utils/apiError.js";

const SIGNED_FIELDS = "total_amount,transaction_uuid,product_code";

const configuration = () => {
    const configuredAmount = Number(process.env.ESEWA_PLUS_AMOUNT);
    const amount = Number.isFinite(configuredAmount) ? Number(moneyString(configuredAmount)) : NaN;
    const durationDays = Number(process.env.ESEWA_PLUS_DURATION_DAYS);
    const productCode = process.env.ESEWA_PRODUCT_CODE;
    const secretKey = process.env.ESEWA_SECRET_KEY;
    const enabled = Boolean(
        productCode && secretKey && Number.isFinite(amount) && amount > 0 &&
        Math.abs(configuredAmount * 100 - Math.round(configuredAmount * 100)) < 0.000001 &&
        Number.isInteger(durationDays) && durationDays > 0
    );

    return { amount, durationDays, productCode, secretKey, enabled };
};

const isProduction = () => process.env.ESEWA_ENV === "production";
const frontendUrl = () => (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

const sign = (message, secretKey) =>
    createHmac("sha256", secretKey).update(message).digest("base64");

const sameSignature = (expected, received) => {
    const expectedBytes = Buffer.from(expected);
    const receivedBytes = Buffer.from(received || "");
    return expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes);
};

const moneyString = (value) => Number(value).toFixed(2);

const requireConfiguration = () => {
    const config = configuration();
    if (!config.enabled) {
        throw new ApiError(503, "eSewa checkout is not configured. Set the required eSewa and Plus plan environment variables.");
    }
    return config;
};

export const getPlusPlan = () => {
    const { amount, durationDays, enabled } = configuration();
    return {
        name: "Finora Plus",
        currency: "NPR",
        amount: enabled ? amount : null,
        durationDays: enabled ? durationDays : null,
        enabled,
    };
};

export const initiateEsewaPayment = async (userId) => {
    const config = requireConfiguration();
    const transactionUuid = randomUUID();
    const totalAmount = moneyString(config.amount);

    await prisma.subscriptionPayment.create({
        data: {
            userId,
            transactionUuid,
            productCode: config.productCode,
            amount: config.amount,
        },
    });

    const fields = {
        amount: totalAmount,
        tax_amount: "0",
        total_amount: totalAmount,
        transaction_uuid: transactionUuid,
        product_code: config.productCode,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: `${frontendUrl()}/pricing/esewa/success`,
        failure_url: `${frontendUrl()}/pricing/esewa/failure`,
        signed_field_names: SIGNED_FIELDS,
        signature: sign(
            `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${config.productCode}`,
            config.secretKey
        ),
    };

    return {
        paymentUrl: isProduction()
            ? "https://epay.esewa.com.np/api/epay/main/v2/form"
            : "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
        fields,
    };
};

const decodeResponse = (encodedResponse) => {
    try {
        if (typeof encodedResponse !== "string" || encodedResponse.length > 16384) {
            throw new Error("Invalid response size");
        }
        return JSON.parse(Buffer.from(encodedResponse, "base64").toString("utf8"));
    } catch {
        throw ApiError.badRequest("Invalid eSewa payment response");
    }
};

const verifyResponseSignature = (response, secretKey) => {
    const fields = response.signed_field_names?.split(",");
    if (!fields?.length || fields.some((field) => typeof response[field] !== "string" && typeof response[field] !== "number")) {
        throw ApiError.badRequest("Incomplete eSewa payment response");
    }
    const message = fields.map((field) => `${field}=${response[field]}`).join(",");
    if (!sameSignature(sign(message, secretKey), response.signature)) {
        throw ApiError.badRequest("eSewa payment response signature is invalid");
    }
};

const checkPaymentStatus = async ({ productCode, transactionUuid, amount }) => {
    const endpoint = isProduction()
        ? "https://esewa.com.np/api/epay/transaction/status/"
        : "https://rc.esewa.com.np/api/epay/transaction/status/";
    const url = new URL(endpoint);
    url.search = new URLSearchParams({
        product_code: productCode,
        total_amount: moneyString(amount),
        transaction_uuid: transactionUuid,
    });

    const response = await fetch(url);
    if (!response.ok) throw new Error("Unable to verify payment with eSewa");
    return response.json();
};

export const verifyEsewaPayment = async (userId, encodedResponse) => {
    const config = requireConfiguration();
    const paymentResponse = decodeResponse(encodedResponse);
    verifyResponseSignature(paymentResponse, config.secretKey);

    const payment = await prisma.subscriptionPayment.findFirst({
        where: { userId, transactionUuid: paymentResponse.transaction_uuid },
    });
    if (!payment) throw ApiError.notFound("Payment was not found for this account");

    if (payment.status === "COMPLETE") {
        return { status: payment.status, subscriptionExpiresAt: (await prisma.user.findUnique({ where: { id: userId } })).subscriptionExpiresAt };
    }

    if (
        paymentResponse.product_code !== payment.productCode ||
        Number(paymentResponse.total_amount) !== Number(payment.amount) ||
        paymentResponse.status !== "COMPLETE"
    ) {
        throw ApiError.badRequest("eSewa has not confirmed this payment");
    }

    const status = await checkPaymentStatus({
        productCode: payment.productCode,
        transactionUuid: payment.transactionUuid,
        amount: payment.amount,
    });
    if (
        status.status !== "COMPLETE" ||
        status.product_code !== payment.productCode ||
        status.transaction_uuid !== payment.transactionUuid ||
        Number(status.total_amount) !== Number(payment.amount)
    ) {
        throw ApiError.badRequest("Payment verification did not complete successfully");
    }

    return prisma.$transaction(async (tx) => {
        const updatedPayment = await tx.subscriptionPayment.updateMany({
            where: { id: payment.id, status: "PENDING" },
            data: { status: "COMPLETE", referenceId: status.ref_id || null },
        });

        let account = await tx.user.findUnique({
            where: { id: userId },
            select: { subscriptionTier: true, subscriptionExpiresAt: true },
        });

        if (updatedPayment.count) {
            const startDate = account.subscriptionExpiresAt > new Date()
                ? account.subscriptionExpiresAt
                : new Date();
            const subscriptionExpiresAt = new Date(
                startDate.getTime() + config.durationDays * 24 * 60 * 60 * 1000
            );
            account = await tx.user.update({
                where: { id: userId },
                data: { subscriptionTier: "PLUS", subscriptionExpiresAt },
                select: { subscriptionTier: true, subscriptionExpiresAt: true },
            });
        }

        return { status: "COMPLETE", ...account };
    });
};