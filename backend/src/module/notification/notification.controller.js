import * as notificationService from "./notification.service.js";
import { successResponse } from "../../utils/apiResponse.js";

export const getNotifications = async (req, res, next) => {
    try {
        const unreadOnly = req.query.unread === "true";
        const notifications = await notificationService.getNotifications(req.user.id, unreadOnly);
        return successResponse(res, {
            message: "Notifications retrieved",
            data: notifications
        });
    } catch (error) {
        next(error);
    }
};

export const markNotificationRead = async (req, res, next) => {
    try {
        const notification = await notificationService.markNotificationRead(
            req.user.id,
            req.params.id
        );
        return successResponse(res, {
            message: "Notification marked as read",
            data: notification
        });
    } catch (error) {
        next(error);
    }
};

export const markAllNotificationsRead = async (req, res, next) => {
    try {
        const result = await notificationService.markAllNotificationsRead(req.user.id);
        return successResponse(res, {
            message: "Notifications marked as read",
            data: result
        });
    } catch (error) {
        next(error);
    }
};
