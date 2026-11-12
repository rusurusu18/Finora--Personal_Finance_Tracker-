
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

// Import Prisma client to interact with the database
import prisma from "../../config/database.js";

// Import ApiError for handling custom API errors
import { ApiError } from "../../utils/apiError.js";

// Define the fields used to generate the eSewa payment signature
const SIGNED_FIELDS = "total_amount,transaction_uuid,product_code";


// Read and validate the Finora Plus subscription plan configuration
const planConfiguration = () => {
    // Get the subscription amount from environment variables
    const configuredAmountValue = process.env.PLUS_PLAN_AMOUNT?.trim() || process.env.ESEWA_PLUS_AMOUNT;

    const configuredAmount = Number(configuredAmountValue);
    const amount = Number.isFinite(configuredAmount) ? Number(moneyString(configuredAmount)) : NaN;

    // Get the subscription duration in days
    const durationDaysValue = process.env.PLUS_PLAN_DURATION_DAYS?.trim() || process.env.ESEWA_PLUS_DURATION_DAYS;
    const durationDays = Number(durationDaysValue);

    // Check whether the plan amount and duration are valid
    // The amount must be positive and have no more than two decimal places
    // The duration must be a positive integer
    const validPlan = Number.isFinite(amount) && amount > 0 &&
        Math.abs(configuredAmount * 100 - Math.round(configuredAmount * 100)) < 0.000001 &&
        Number.isInteger(durationDays) && durationDays > 0;

    // Return the plan details and payment provider credentials
    return {
        amount,
        durationDays,
        validPlan,
        esewaProductCode: process.env.ESEWA_PRODUCT_CODE,
        esewaSecretKey: process.env.ESEWA_SECRET_KEY,
        khaltiSecretKey: process.env.KHALTI_SECRET_KEY
    };
};


// Get the eSewa payment configuration
const configuration = () => {
    const plan = planConfiguration();

    // Enable eSewa only when the plan and required eSewa credentials are valid
    const enabled = Boolean(plan.validPlan && plan.esewaProductCode && plan.esewaSecretKey);

    return {
        amount: plan.amount,
        durationDays: plan.durationDays,
        productCode: plan.esewaProductCode,
        secretKey: plan.esewaSecretKey,
        enabled
    };
};


// Check whether the application is running in production mode
const isProduction = () => process.env.ESEWA_ENV === "production";

// Get the frontend URL and remove any trailing slash
const frontendUrl = () => (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");


// Generate an HMAC SHA-256 signature and encode it using Base64
// This signature helps verify the authenticity of eSewa payment data
const sign = (message, secretKey) =>
    createHmac("sha256", secretKey).update(message).digest("base64");


// Compare two signatures securely to prevent timing-based attacks
const sameSignature = (expected, received) => {
    const expectedBytes = Buffer.from(expected);
    const receivedBytes = Buffer.from(received || "");

    // Compare only when both signatures have the same length
    return expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes);
};


// Convert a numeric amount into a string with exactly two decimal places
const moneyString = (value) => Number(value).toFixed(2);


// Check whether the eSewa payment configuration is available
const requireConfiguration = () => {
    const config = configuration();

    // Throw an error if the required plan or eSewa settings are missing
    if (!config.enabled) {
        throw new ApiError(503, "eSewa checkout is not configured. Set the required eSewa and Plus plan environment variables.");
    }

    return config;
};


// Retrieve Finora Plus plan details and available payment providers
export const getPlusPlan = () => {
    const plan = planConfiguration();

    // Check whether each payment provider is properly configured
    const providers = {
        esewa: Boolean(plan.validPlan && plan.esewaProductCode && plan.esewaSecretKey),
        khalti: Boolean(plan.validPlan && plan.khaltiSecretKey)
    };

    // Enable the subscription if at least one provider is available
    const enabled = Object.values(providers).some(Boolean);

    return {
        name: "Finora Plus",
        currency: "NPR",
        amount: enabled ? plan.amount : null,
        durationDays: enabled ? plan.durationDays : null,
        providers,
        enabled
    };
};


// Initiate a new subscription payment through eSewa
export const initiateEsewaPayment = async (userId) => {
    // Verify that eSewa is properly configured
    const config = requireConfiguration();

    // Generate a unique transaction ID for this payment
    const transactionUuid = randomUUID();

    // Format the subscription amount to two decimal places
    const totalAmount = moneyString(config.amount);

    // Create a pending payment record in the database
    await prisma.subscriptionPayment.create({
        data: {
            userId,
            transactionUuid,
            productCode: config.productCode,
            amount: config.amount
        }
    });

    // Prepare the payment fields required by the eSewa checkout form
    const fields = {
        amount: totalAmount,
        tax_amount: "0",
        total_amount: totalAmount,
        transaction_uuid: transactionUuid,
        product_code: config.productCode,
        product_service_charge: "0",
        product_delivery_charge: "0",

        // Redirect the user to the appropriate frontend page after payment
        success_url: `${frontendUrl()}/pricing/esewa/success`,
        failure_url: `${frontendUrl()}/pricing/esewa/failure`,

        // Specify which fields are included in the payment signature
        signed_field_names: SIGNED_FIELDS,

        // Generate a secure signature using the eSewa secret key
        signature: sign(
            `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${config.productCode}`,
            config.secretKey
        )
    };

    // Return the eSewa checkout URL and payment form fields
    return {
        paymentUrl: isProduction()
            ? "https://epay.esewa.com.np/api/epay/main/v2/form"
            : "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
        fields
    };
};


// Initiate a new subscription payment through Khalti
export const initiateKhaltiPayment = async (userId) => {
    // Retrieve the Plus plan configuration
    const plan = planConfiguration();

    // Check whether the plan and Khalti secret key are configured
    if (!plan.validPlan || !plan.khaltiSecretKey) {
        throw new ApiError(503, "Khalti checkout is not configured. Set KHALTI_SECRET_KEY and the Plus plan environment variables.");
    }

    // Generate a unique transaction ID
    const transactionUuid = randomUUID();

    // Create a pending subscription payment record
    const payment = await prisma.subscriptionPayment.create({
        data: {
            userId,
            transactionUuid,
            provider: "KHALTI",
            amount: plan.amount
        }
    });

    let response;

    try {
        // Send a payment initiation request to the Khalti API
        response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
            method: "POST",
            headers: {
                Authorization: `Key ${plan.khaltiSecretKey}`,
                "Content-Type": "application/json"
            },

            // Send the required payment details to Khalti
            body: JSON.stringify({
                return_url: `${frontendUrl()}/pricing/khalti/result`,
                website_url: frontendUrl(),
                amount: Math.round(plan.amount * 100),
                purchase_order_id: transactionUuid,
                purchase_order_name: "Finora Plus subscription"
            }),

            // Stop waiting if Khalti does not respond within 10 seconds
            signal: AbortSignal.timeout(10_000)
        });
    } catch {
        // Mark the payment as failed if the initiation request cannot be completed
        await prisma.subscriptionPayment.update({
            where: { id: payment.id },
            data: { status: "FAILED" }
        });

        throw new ApiError(502, "Khalti checkout could not be started. Please try again.");
    }

    // Convert Khalti's response into JSON
    const result = await response.json().catch(() => null);

    // Check whether the response is successful and contains required payment details
    if (!response.ok || typeof result?.pidx !== "string" || typeof result?.payment_url !== "string") {
        await prisma.subscriptionPayment.update({
            where: { id: payment.id },
            data: { status: "FAILED" }
        });

        throw new ApiError(502, "Khalti checkout could not be started. Please try again.");
    }

    // Save Khalti's payment identifier (pidx) in the database
    await prisma.subscriptionPayment.update({
        where: { id: payment.id },
        data: { pidx: result.pidx }
    });

    // Return the checkout URL so the frontend can redirect the user to Khalti
    return { paymentUrl: result.payment_url };
};


// Decode the Base64-encoded payment response received from eSewa
const decodeResponse = (encodedResponse) => {
    try {
        // Validate the response type and maximum allowed size
        if (typeof encodedResponse !== "string" || encodedResponse.length > 16384) {
            throw new Error("Invalid response size");
        }

        // Decode the Base64 string and convert it into a JavaScript object
        return JSON.parse(Buffer.from(encodedResponse, "base64").toString("utf8"));
    } catch {
        // Return a custom error if decoding or parsing fails
        throw ApiError.badRequest("Invalid eSewa payment response");
    }
};


// Verify the digital signature received from eSewa
const verifyResponseSignature = (response, secretKey) => {
    // Extract the names of the fields included in the signature
    const fields = response.signed_field_names?.split(",");

    // Check whether all signed fields contain valid values
    if (!fields?.length || fields.some((field) => typeof response[field] !== "string" && typeof response[field] !== "number")) {
        throw ApiError.badRequest("Incomplete eSewa payment response");
    }

    // Reconstruct the message using the received signed fields
    const message = fields.map((field) => `${field}=${response[field]}`).join(",");

    // Generate the expected signature and compare it with the received signature
    if (!sameSignature(sign(message, secretKey), response.signature)) {
        throw ApiError.badRequest("eSewa payment response signature is invalid");
    }
};


// Verify the payment status directly with eSewa's transaction status API
const checkPaymentStatus = async ({ productCode, transactionUuid, amount }) => {
    // Select the appropriate eSewa verification endpoint
    const endpoint = isProduction()
        ? "https://esewa.com.np/api/epay/transaction/status/"
        : "https://rc.esewa.com.np/api/epay/transaction/status/";

    // Build the verification URL with the transaction details
    const url = new URL(endpoint);

    url.search = new URLSearchParams({
        product_code: productCode,
        total_amount: moneyString(amount),
        transaction_uuid: transactionUuid
    });

    // Send a request to eSewa to verify the actual payment status
    const response = await fetch(url);

    // Throw an error if eSewa cannot verify the transaction
    if (!response.ok) throw new Error("Unable to verify payment with eSewa");

    // Return the transaction status received from eSewa
    return response.json();
};


// Verify an eSewa payment and activate the user's Plus subscription
export const verifyEsewaPayment = async (userId, encodedResponse) => {
    // Get the eSewa configuration
    const config = requireConfiguration();

    // Decode the payment response and verify its digital signature
    const paymentResponse = decodeResponse(encodedResponse);
    verifyResponseSignature(paymentResponse, config.secretKey);

    // Find the payment record using the user ID and transaction UUID
    const payment = await prisma.subscriptionPayment.findFirst({
        where: { userId, transactionUuid: paymentResponse.transaction_uuid, provider: "ESEWA" }
    });

    // Ensure the payment belongs to the logged-in user
    if (!payment) throw ApiError.notFound("Payment was not found for this account");

    // If the payment is already complete, return the existing subscription expiry date
    if (payment.status === "COMPLETE") {
        return {
            status: payment.status,
            subscriptionExpiresAt: (await prisma.user.findUnique({ where: { id: userId } })).subscriptionExpiresAt
        };
    }

    // Validate the product code, payment amount, and payment status
    if (
        paymentResponse.product_code !== payment.productCode ||
        Number(paymentResponse.total_amount) !== Number(payment.amount) ||
        paymentResponse.status !== "COMPLETE"
    ) {
        throw ApiError.badRequest("eSewa has not confirmed this payment");
    }

    // Independently verify the transaction status using eSewa's server API
    const status = await checkPaymentStatus({
        productCode: payment.productCode,
        transactionUuid: payment.transactionUuid,
        amount: payment.amount
    });

    // Confirm that the server-side transaction details match the stored payment
    if (
        status.status !== "COMPLETE" ||
        status.product_code !== payment.productCode ||
        status.transaction_uuid !== payment.transactionUuid ||
        Number(status.total_amount) !== Number(payment.amount)
    ) {
        throw ApiError.badRequest("Payment verification did not complete successfully");
    }

    // Use a database transaction to update payment and subscription together
    return prisma.$transaction(async (tx) => {
        // Mark the payment as complete only if it is still pending
        // This helps prevent the same payment from being processed more than once
        const updatedPayment = await tx.subscriptionPayment.updateMany({
            where: { id: payment.id, status: "PENDING" },
            data: { status: "COMPLETE", referenceId: status.ref_id || null }
        });

        // Retrieve the user's current subscription details
        let account = await tx.user.findUnique({
            where: { id: userId },
            select: { subscriptionTier: true, subscriptionExpiresAt: true }
        });

        // Extend the subscription only if this payment was successfully updated
        if (updatedPayment.count) {
            // If the user already has an active subscription, extend from its expiry date
            // Otherwise, start the new subscription from the current date
            const startDate = account.subscriptionExpiresAt > new Date()
                ? account.subscriptionExpiresAt
                : new Date();

            // Calculate the new subscription expiry date
            const subscriptionExpiresAt = new Date(
                startDate.getTime() + config.durationDays * 24 * 60 * 60 * 1000
            );

            // Upgrade the user to Finora Plus and save the new expiry date
            account = await tx.user.update({
                where: { id: userId },
                data: { subscriptionTier: "PLUS", subscriptionExpiresAt },
                select: { subscriptionTier: true, subscriptionExpiresAt: true }
            });
        }

        // Return the completed payment status and updated subscription details
        return { status: "COMPLETE", ...account };
    });
};


// Verify a Khalti payment and activate the user's Plus subscription
export const verifyKhaltiPayment = async (userId, pidx) => {
    // Retrieve the Plus plan configuration
    const plan = planConfiguration();

    // Check whether Khalti payment settings are properly configured
    if (!plan.validPlan || !plan.khaltiSecretKey) {
        throw new ApiError(503, "Khalti checkout is not configured.");
    }

    // Validate the payment reference received from the frontend
    if (typeof pidx !== "string" || !pidx || pidx.length > 128) {
        throw ApiError.badRequest("Invalid Khalti payment reference");
    }

    // Find the payment record belonging to the logged-in user
    const payment = await prisma.subscriptionPayment.findFirst({
        where: { userId, pidx, provider: "KHALTI" }
    });

    // Ensure the payment exists and belongs to this user
    if (!payment) throw ApiError.notFound("Khalti payment was not found for this account");

    // If the payment is already complete, return the current subscription details
    if (payment.status === "COMPLETE") {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { subscriptionTier: true, subscriptionExpiresAt: true }
        });

        return { status: payment.status, ...user };
    }

    // Only pending payments can be verified and completed
    if (payment.status !== "PENDING") {
        throw ApiError.badRequest("This Khalti payment is no longer pending");
    }

    let response;

    try {
        // Send a payment lookup request to Khalti using the saved pidx
        response = await fetch("https://a.khalti.com/api/v2/epayment/lookup/", {
            method: "POST",
            headers: {
                Authorization: `Key ${plan.khaltiSecretKey}`,
                "Content-Type": "application/json"
            },

            // Send the unique payment reference for verification
            body: JSON.stringify({ pidx }),

            // Set a 10-second timeout for the Khalti API request
            signal: AbortSignal.timeout(10_000)
        });
    } catch {
        // Return an error if Khalti cannot be reached
        throw new ApiError(502, "Unable to verify this payment with Khalti.");
    }

    // Parse Khalti's response into JSON
    const result = await response.json().catch(() => null);

    // Check whether the lookup request was successful
    if (!response.ok) throw new ApiError(502, "Unable to verify this payment with Khalti.");

    // Validate the payment status, amount, and transaction reference
    if (
        result?.status !== "Completed" ||
        Number(result?.amount) !== Math.round(Number(payment.amount) * 100) ||
        result?.purchase_order_id !== payment.transactionUuid
    ) {
        // Mark the payment as failed if Khalti reports a cancelled, expired, or refunded payment
        if (["User canceled", "Expired", "Refunded", "Partially Refunded"].includes(result?.status)) {
            await prisma.subscriptionPayment.updateMany({
                where: { id: payment.id, status: "PENDING" },
                data: { status: "FAILED" }
            });
        }

        // Reject the payment if Khalti has not confirmed successful completion
        throw ApiError.badRequest("Khalti has not confirmed this payment");
    }

    // Use a database transaction to update the payment and subscription together
    return prisma.$transaction(async (tx) => {
        // Mark the payment as complete only if it is still pending
        const updatedPayment = await tx.subscriptionPayment.updateMany({
            where: { id: payment.id, status: "PENDING" },
            data: { status: "COMPLETE", referenceId: result.transaction_id || null }
        });

        // Retrieve the user's current subscription details
        let user = await tx.user.findUnique({
            where: { id: userId },
            select: { subscriptionTier: true, subscriptionExpiresAt: true }
        });

        // Extend the subscription only when the payment was successfully updated
        if (updatedPayment.count) {
            // Continue from the existing expiry date if the subscription is still active
            // Otherwise, begin the new subscription from the current date
            const startDate = user.subscriptionExpiresAt > new Date()
                ? user.subscriptionExpiresAt
                : new Date();

            // Calculate the new subscription expiry date
            const subscriptionExpiresAt = new Date(
                startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000
            );

            // Activate Finora Plus and update the subscription expiry date
            user = await tx.user.update({
                where: { id: userId },
                data: { subscriptionTier: "PLUS", subscriptionExpiresAt },
                select: { subscriptionTier: true, subscriptionExpiresAt: true }
            });
        }

        // Return the completed payment status and updated subscription information
        return { status: "COMPLETE", ...user };
    });
};
