import prisma from "../../config/database.js";
import { ApiError } from "../../utils/apiError.js";

export const translateText = async (userId, text) => {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
        throw new ApiError(503, "Translation service is not configured");
    }

    let response;
    try {
        const endpoint = process.env.GOOGLE_TRANSLATE_API_URL
            || "https://translation.googleapis.com/language/translate/v2";
        const url = new URL(endpoint);
        url.searchParams.set("key", apiKey);

        response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                q: text,
                source: "en",
                target: "ne",
                format: "text",
            }),
            signal: AbortSignal.timeout(20000)
        });
    } catch {
        throw new ApiError(502, "Translation service could not be reached");
    }

    if (!response.ok) {
        throw new ApiError(502, "Translation service could not complete the request");
    }

    const result = await response.json().catch(() => null);
    const translatedText = result?.data?.translations?.[0]?.translatedText;
    if (typeof translatedText !== "string" || !translatedText.trim()) {
        throw new ApiError(502, "Translation service returned an invalid response");
    }

    return prisma.translation.create({
        data: {
            userId,
            sourceText: text,
            translatedText
        }
    });
};