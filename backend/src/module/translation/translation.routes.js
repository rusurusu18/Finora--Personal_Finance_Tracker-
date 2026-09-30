import express from "express";
import { authenticate } from "../../middleware/authMiddleware.js";
import { validate } from "../../middleware/validateMiddleware.js";
import * as translationController from "./translation.controller.js";
import { translateTextSchema } from "./translation.schema.js";

const router = express.Router();

router.use(authenticate);
router.post("/translate", validate(translateTextSchema), translationController.translateText);

export default router;