import express from "express";
import * as notificationController from "./notification.controller.js";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Notifications are scoped to the signed-in user by the shared authentication middleware.
router.use(authenticate);

// List the user's notifications, mark all as read, or mark one notification as read.
router.get("/", notificationController.getNotifications);
router.patch("/read-all", notificationController.markAllNotificationsRead);
router.patch("/:id/read", notificationController.markNotificationRead);

export default router;
