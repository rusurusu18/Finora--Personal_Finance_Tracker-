import express from "express";
import * as paymentController from "./payment.controller.js";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/esewa/plus-plan", paymentController.getPlusPlan);
router.post("/esewa/initiate", authenticate, paymentController.initiateEsewaPayment);
router.post("/esewa/verify", authenticate, paymentController.verifyEsewaPayment);

export default router;