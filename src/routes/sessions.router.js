import express from "express";
import { getSessionById, register, search } from "../controllers/sessions.controller.js";
import { validate, validateParams, validateQuery } from "../middlewares/validate.middleware.js";
import {
  sessionIdParamSchema,
  registerSchema,
  searchSessionsQuerySchema,
} from "../validations/sessions.validation.js";
const router = express.Router();

router.get("/", validateQuery(searchSessionsQuerySchema), search);

router.post(
  "/:sessionId/register",
  validateParams(sessionIdParamSchema),
  validate(registerSchema),
  register,
);

router.get("/:sessionId", validateParams(sessionIdParamSchema), getSessionById);

export default router;
