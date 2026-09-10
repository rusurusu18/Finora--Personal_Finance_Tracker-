import express from "express";

import * as categoryController from "./category.controller.js";
import { createCategorySchema, updateCategorySchema } from "./category.schema.js";
import { authenticate } from "../../middleware/authMiddleware.js";
import { validate }     from "../../middleware/validateMiddleware.js";


const router = express.Router();

router.use(authenticate);


// POST   /api/categories/seed-defaults  (admin-style, before /:id routes)
router.post(  "/seed-defaults", categoryController.seedDefaults);

// GET    /api/categories
router.get(   "/",    categoryController.getCategories);

// POST   /api/categories
router.post(  "/",    validate(createCategorySchema), categoryController.createCategory);

// GET    /api/categories/:id
router.get(   "/:id", categoryController.getCategory);

// PATCH  /api/categories/:id
router.patch( "/:id", validate(updateCategorySchema), categoryController.updateCategory);

// DELETE /api/categories/:id
router.delete("/:id", categoryController.deleteCategory);


export default router;
