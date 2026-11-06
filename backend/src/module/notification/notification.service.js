// Import Prisma client to interact with the database
import prisma from "../../config/database.js";

// Import ApiError to handle custom API errors
import { ApiError } from "../../utils/apiError.js";

// Convert notification database records into a simplified response format
const toNotificationDto = (notification) => ({
    id: notification.id,                 // Unique notification ID
    title: notification.title,           // Notification title
    body: notification.message,          // Notification message
    type: notification.type,             // Type or category of notification
    read: notification.isRead,           // Indicates whether the notification has been read
    createdAt: notification.createdAt    // Date and time the notification was created
});

// Get all notifications belonging to a specific user
export const getNotifications = async (userId, unreadOnly = false) => {

    // Retrieve notifications from the database
    const notifications = await prisma.notification.findMany({
        where: {
            userId, // Fetch only notifications belonging to the given user

            // If unreadOnly is true, retrieve only unread notifications
            // Otherwise, retrieve both read and unread notifications
            ...(unreadOnly ? { isRead: false } : {})
        },

        // Display the newest notifications first
        orderBy: { createdAt: "desc" }
    });

    // Convert database records into simplified notification objects
    return notifications.map(toNotificationDto);
};

// Mark a specific notification as read
export const markNotificationRead = async (userId, notificationId) => {

    // Find the notification using its ID and the user's ID
    // This ensures the notification belongs to the requesting user
    const notification = await prisma.notification.findFirst({
        where: { id: notificationId, userId }
    });

    // If the notification does not exist or does not belong to the user,
    // throw a 404 Not Found error
    if (!notification) throw ApiError.notFound("Notification not found");

    // Update the notification's read status to true
    const updated = await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
    });

    // Return the updated notification in a simplified response format
    return toNotificationDto(updated);
};

// Mark all unread notifications of a specific user as read
export const markAllNotificationsRead = async (userId) => {

    // Update all unread notifications belonging to the given user
    const result = await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
    });

    // Return the total number of notifications that were updated
    return { updated: result.count };
};