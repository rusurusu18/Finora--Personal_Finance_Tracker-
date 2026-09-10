import express from "express";

import * as accountController from "./account.controller.js";
import { createAccountSchema, updateAccountSchema } from "./account.schema.js";
import { authenticate } from "../../middleware/authMiddleware.js";
import { validate }     from "../../middleware/validateMiddleware.js";


const router = express.Router();

router.use(authenticate);


// GET    /api/accounts
router.get(   "/",    accountController.getAccounts);

// POST   /api/accounts
router.post(  "/",    validate(createAccountSchema), accountController.createAccount);

// GET    /api/accounts/:id
router.get(   "/:id", accountController.getAccount);

// PATCH  /api/accounts/:id
router.patch( "/:id", validate(updateAccountSchema), accountController.updateAccount);

// DELETE /api/accounts/:id
router.delete("/:id", accountController.deleteAccount);


export default router;
