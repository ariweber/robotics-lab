import express from "express";
import { getSessionById, register } from "../controllers/sessions.controller.js";
import { validate, validateParams } from "../middlewares/validate.middleware.js";
import { sessionIdParamSchema, registerSchema} from "../validations/sessions.validation.js";
const router = express.Router();

router.post(
  "/:sessionId/register",
  validateParams(sessionIdParamSchema),
  validate(registerSchema),
  register,
);

router.get("/:sessionId", validateParams(sessionIdParamSchema), getSessionById);

export default router;
