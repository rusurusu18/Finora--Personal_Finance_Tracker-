// Import notification service functions to handle notification-related operations
import * as notificationService from "./notification.service.js";

// Import the utility function to send standardized success responses
import { successResponse } from "../../utils/apiResponse.js";

// Get all notifications for the currently logged-in user
export const getNotifications = async (req, res, next) => {
    try {
        // Check whether the request asks for unread notifications only
        // Example: GET /notifications?unread=true
        const unreadOnly = req.query.unread === "true";

        // Fetch the user's notifications, optionally filtering for unread ones
        const notifications = await notificationService.getNotifications(
            req.user.id,
            unreadOnly
        );

        // Return a successful response containing the retrieved notifications
        return successResponse(res, {
            message: "Notifications retrieved",
            data: notifications
        });
    } catch (error) {
        // Pass any error to the Express error-handling middleware
        next(error);
    }
};

// Mark a specific notification as read
export const markNotificationRead = async (req, res, next) => {
    try {
        // Get the logged-in user's ID and the notification ID from the URL
        // Example: PATCH /notifications/123/read
        const notification = await notificationService.markNotificationRead(
            req.user.id,
            req.params.id
        );

        // Return a successful response with the updated notification
        return successResponse(res, {
            message: "Notification marked as read",
            data: notification
        });
    } catch (error) {
        // Pass any error to the Express error-handling middleware
        next(error);
    }
};

// Mark all notifications belonging to the logged-in user as read
export const markAllNotificationsRead = async (req, res, next) => {
    try {
        // Call the service function to mark all the user's notifications as read
        const result = await notificationService.markAllNotificationsRead(
            req.user.id
        );

        // Return a successful response with the operation result
        return successResponse(res, {
            message: "Notifications marked as read",
            data: result
        });
    } catch (error) {
        // Pass any error to the Express error-handling middleware
        next(error);
    }
};