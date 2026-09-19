import express from "express";
import * as notificationController from "./notification.controller.js";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", notificationController.getNotifications);
router.patch("/read-all", notificationController.markAllNotificationsRead);
router.patch("/:id/read", notificationController.markNotificationRead);

export default router;
