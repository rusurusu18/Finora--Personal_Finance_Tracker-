import prisma from "../../config/database.js";
import { ApiError } from "../../utils/apiError.js";


// ==========================================
// GET MY PROFILE
// ==========================================

export const getMe = async (userId) => {

    const user = await prisma.user.findUnique({
        where : { id: userId },
        select: {
            id       : true,
            fullName : true,
            email    : true,
            phone    : true,
            avatarUrl: true,
            currency : true,
            role     : true,
            createdAt: true,
            updatedAt: true,
            _count   : {
                select: {
                    accounts    : true,
                    transactions: true,
                    budgets     : true,
                    savingsGoals: true
                }
            }
        }
    });

    if (!user) throw ApiError.notFound("User not found");

    return user;
};


// ==========================================
// UPDATE PROFILE
// ==========================================

export const updateMe = async (userId, data) => {

    const user = await prisma.user.update({
        where : { id: userId },
        data,
        select: {
            id       : true,
            fullName : true,
            email    : true,
            phone    : true,
            avatarUrl: true,
            currency : true,
            role     : true,
            updatedAt: true
        }
    });

    return user;
};


// ==========================================
// DELETE MY ACCOUNT
// ==========================================

export const deleteMe = async (userId) => {

    await prisma.user.delete({
        where: { id: userId }
    });

    return { message: "Account deleted successfully" };
};
