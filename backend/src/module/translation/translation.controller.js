// Import the utility function to send standardized success responses
import { successResponse } from "../../utils/apiResponse.js";

// Import all functions from the translation service
import * as translationService from "./translation.service.js";

// Controller function to handle text translation requests
export const translateText = async (req, res, next) => {
    try {
        // Get the logged-in user's ID and the text provided in the request body
        // Call the translation service to translate and save the text
        const translation = await translationService.translateText(
            req.user.id,
            req.body.text
        );

        // Send a successful response containing the original and translated text
        return successResponse(res, {
            message: "Text translated and saved",
            data: {
                english: translation.sourceText,       // Original English text
                nepali: translation.translatedText,     // Translated Nepali text
                id: translation.id,                     // Unique translation record ID
                createdAt: translation.createdAt        // Date and time the translation was created
            }
        });
    } catch (error) {
        // Pass any error to the centralized Express error-handling middleware
        next(error);
    }
};