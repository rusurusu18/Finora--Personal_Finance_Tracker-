import * as categoryService from "./category.service.js";
import { successResponse, createdResponse } from "../../utils/apiResponse.js";


export const getCategories = async (req, res, next) => {
    try {
        const { type } = req.query;
        const categories = await categoryService.getCategories(req.user.id, type);
        return successResponse(res, { message: "Categories retrieved", data: categories });
    } catch (error) { next(error); }
};

export const getCategory = async (req, res, next) => {
    try {
        const category = await categoryService.getCategory(req.user.id, req.params.id);
        return successResponse(res, { message: "Category retrieved", data: category });
    } catch (error) { next(error); }
};

export const createCategory = async (req, res, next) => {
    try {
        const category = await categoryService.createCategory(req.user.id, req.body);
        return createdResponse(res, { message: "Category created", data: category });
    } catch (error) { next(error); }
};

export const updateCategory = async (req, res, next) => {
    try {
        const category = await categoryService.updateCategory(req.user.id, req.params.id, req.body);
        return successResponse(res, { message: "Category updated", data: category });
    } catch (error) { next(error); }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const result = await categoryService.deleteCategory(req.user.id, req.params.id);
        return successResponse(res, { message: result.message });
    } catch (error) { next(error); }
};

export const seedDefaults = async (req, res, next) => {
    try {
        const result = await categoryService.seedDefaultCategories();
        return successResponse(res, { message: result.message });
    } catch (error) { next(error); }
};
