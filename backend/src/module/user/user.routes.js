import express from "express";

import * as userController  from "./user.controller.js";
import { updateProfileSchema } from "./user.schema.js";
import { authenticate }        from "../../middleware/authMiddleware.js";
import { validate }            from "../../middleware/validateMiddleware.js";


const router = express.Router();

// All user routes require authentication
router.use(authenticate);


// GET    /api/users/me
router.get(
    "/me",
    userController.getMe
);

// PATCH  /api/users/me
router.patch(
    "/me",
    validate(updateProfileSchema),
    userController.updateMe
);

// DELETE /api/users/me
router.delete(
    "/me",
    userController.deleteMe
);


export default router;
