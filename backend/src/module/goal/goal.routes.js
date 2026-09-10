import express from "express";

import * as goalController from "./goal.controller.js";
import {
    createGoalSchema,
    updateGoalSchema,
    depositSchema
} from "./goal.schema.js";
import { authenticate } from "../../middleware/authMiddleware.js";
import { validate }     from "../../middleware/validateMiddleware.js";


const router = express.Router();

router.use(authenticate);


// GET    /api/goals
router.get(   "/",            goalController.getGoals);

// POST   /api/goals
router.post(  "/",            validate(createGoalSchema), goalController.createGoal);

// GET    /api/goals/:id
router.get(   "/:id",         goalController.getGoal);

// PATCH  /api/goals/:id
router.patch( "/:id",         validate(updateGoalSchema), goalController.updateGoal);

// POST   /api/goals/:id/deposit
router.post(  "/:id/deposit", validate(depositSchema), goalController.depositToGoal);

// DELETE /api/goals/:id
router.delete("/:id",         goalController.deleteGoal);


export default router;
