import prisma from "../../config/database.js";
import { ApiError } from "../../utils/apiError.js";
import {
    DEFAULT_INCOME_CATEGORIES,
    DEFAULT_EXPENSE_CATEGORIES
} from "../../constants/index.js";


// ==========================================
// LIST CATEGORIES
// Returns user's categories + system defaults
// ==========================================

export const getCategories = async (userId, type) => {

    const where = {
        OR: [
            { userId, isDefault: false },
            { userId: null, isDefault: true }
        ]
    };

    if (type) where.type = type;

    const categories = await prisma.category.findMany({
        where,
        orderBy: [{ isDefault: "desc" }, { name: "asc" }]
    });

    return categories;
};


// ==========================================
// GET SINGLE CATEGORY
// ==========================================

export const getCategory = async (userId, categoryId) => {

    const category = await prisma.category.findFirst({
        where: {
            id: categoryId,
            OR: [{ userId }, { isDefault: true }]
        }
    });

    if (!category) throw ApiError.notFound("Category not found");

    return category;
};


// ==========================================
// CREATE CATEGORY
// ==========================================

export const createCategory = async (userId, data) => {

    const category = await prisma.category.create({
        data: {
            userId,
            name     : data.name,
            type     : data.type,
            color    : data.color ?? "#6366f1",
            icon     : data.icon  ?? "📦",
            isDefault: false
        }
    });

    return category;
};


// ==========================================
// UPDATE CATEGORY
// ==========================================

export const updateCategory = async (userId, categoryId, data) => {

    const category = await prisma.category.findFirst({
        where: { id: categoryId, userId, isDefault: false }
    });

    if (!category) throw ApiError.notFound("Category not found or cannot be modified");

    const updated = await prisma.category.update({
        where: { id: categoryId },
        data
    });

    return updated;
};


// ==========================================
// DELETE CATEGORY
// ==========================================

export const deleteCategory = async (userId, categoryId) => {

    const category = await prisma.category.findFirst({
        where: { id: categoryId, userId, isDefault: false }
    });

    if (!category) throw ApiError.notFound("Category not found or cannot be deleted");

    // Nullify transactions referencing this category
    await prisma.transaction.updateMany({
        where: { categoryId },
        data : { categoryId: null }
    });

    await prisma.category.delete({ where: { id: categoryId } });

    return { message: "Category deleted successfully" };
};


// ==========================================
// SEED DEFAULT CATEGORIES FOR A USER
// Called after registration
// ==========================================

export const seedDefaultCategories = async () => {

    const existing = await prisma.category.findFirst({
        where: { isDefault: true }
    });

    if (existing) return { message: "Default categories already seeded" };

    const incomeData  = DEFAULT_INCOME_CATEGORIES.map(c => ({
        ...c, type: "INCOME", isDefault: true, userId: null
    }));

    const expenseData = DEFAULT_EXPENSE_CATEGORIES.map(c => ({
        ...c, type: "EXPENSE", isDefault: true, userId: null
    }));

    await prisma.category.createMany({
        data: [...incomeData, ...expenseData],
        skipDuplicates: true
    });

    return { message: "Default categories seeded successfully" };
};
