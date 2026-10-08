import express from "express";
import * as paymentController from "./payment.controller.js";
import { verifyKhaltiPaymentSchema } from "./payment.schema.js";
import { authenticate } from "../../middleware/authMiddleware.js";
import { validate } from "../../middleware/validateMiddleware.js";

const router = express.Router();

router.get("/plus-plan", paymentController.getPlusPlan);
router.get("/esewa/plus-plan", paymentController.getPlusPlan);
router.post("/esewa/initiate", authenticate, paymentController.initiateEsewaPayment);
router.post("/esewa/verify", authenticate, paymentController.verifyEsewaPayment);
router.post("/khalti/initiate", authenticate, paymentController.initiateKhaltiPayment);
router.post("/khalti/verify", authenticate, validate(verifyKhaltiPaymentSchema), paymentController.verifyKhaltiPayment);

export default router;