import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { createUserSchema } from "../validations/users.validation.js";
import { createUser, getUserById } from "../controllers/users.controller.js";

const router = express.Router();

router.post("/", validate(createUserSchema), createUser);

router.get("/:userId", getUserById);

export default router;
