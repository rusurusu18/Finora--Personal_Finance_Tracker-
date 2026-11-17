import prisma from "../../config/database.js";
import { ApiError } from "../../utils/apiError.js";

// Creates a fetch timeout wrapper so requests fail cleanly instead of hanging forever.
const createAbortSignal = (timeoutMs) => {
    if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
        return { signal: AbortSignal.timeout(timeoutMs), cleanup: () => undefined };
    }

    // Fallback for environments without AbortSignal.timeout.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    return {
        signal: controller.signal,
        cleanup: () => clearTimeout(timeoutId)
    };
};

// Translates English text into Nepali and stores the original + translated version.
export const translateText = async (userId, text) => {
    // Required API key is needed before making any external translation request.
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
        throw new ApiError(503, "Translation service is not configured");
    }

    let response;
    const timeout = createAbortSignal(20000);

    try {
        // Use the configured endpoint or the default Google Translate API URL.
        const endpoint = process.env.GOOGLE_TRANSLATE_API_URL
            || "https://translation.googleapis.com/language/translate/v2";
        const url = new URL(endpoint);
        url.searchParams.set("key", apiKey);

        // Send the text payload to the translation API with a request timeout.
        response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                q: text,
                source: "en",
                target: "ne",
                format: "text",
            }),
            signal: timeout.signal
        });
    } catch {
        // Any network or timeout failure is surfaced as a downstream service issue.
        throw new ApiError(502, "Translation service could not be reached");
    } finally {
        timeout.cleanup();
    }

    if (!response.ok) {
        throw new ApiError(502, "Translation service could not complete the request");
    }

    const result = await response.json().catch(() => null);
    const translatedText = result?.data?.translations?.[0]?.translatedText;
    if (typeof translatedText !== "string" || !translatedText.trim()) {
        throw new ApiError(502, "Translation service returned an invalid response");
    }

    // Persist the translated content so it can be referenced later by the user.
    return prisma.translation.create({
        data: {
            userId,
            sourceText: text,
            translatedText
        }
    });
};