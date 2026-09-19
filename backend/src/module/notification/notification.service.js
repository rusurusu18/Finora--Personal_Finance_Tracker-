import prisma from "../../config/database.js";
import { ApiError } from "../../utils/apiError.js";

const toNotificationDto = (notification) => ({
    id: notification.id,
    title: notification.title,
    body: notification.message,
    type: notification.type,
    read: notification.isRead,
    createdAt: notification.createdAt
});

export const getNotifications = async (userId, unreadOnly = false) => {
    const notifications = await prisma.notification.findMany({
        where: {
            userId,
            ...(unreadOnly ? { isRead: false } : {})
        },
        orderBy: { createdAt: "desc" }
    });

    return notifications.map(toNotificationDto);
};

export const markNotificationRead = async (userId, notificationId) => {
    const notification = await prisma.notification.findFirst({
        where: { id: notificationId, userId }
    });

    if (!notification) throw ApiError.notFound("Notification not found");

    const updated = await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
    });

    return toNotificationDto(updated);
};

export const markAllNotificationsRead = async (userId) => {
    const result = await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
    });

    return { updated: result.count };
};
