import { successResponse } from "../../utils/apiResponse.js";
import * as translationService from "./translation.service.js";

export const translateText = async (req, res, next) => {
    try {
        const translation = await translationService.translateText(req.user.id, req.body.text);
        return successResponse(res, {
            message: "Text translated and saved",
            data: {
                english: translation.sourceText,
                nepali: translation.translatedText,
                id: translation.id,
                createdAt: translation.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};