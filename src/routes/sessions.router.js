import express from 'express';
import { getSessionById } from '../controllers/sessions.controller.js';
import { validateParams } from '../middlewares/validate.middleware.js';
import { sessionIdParamSchema } from '../validations/sessions.validation.js';
const router = express.Router()

router.post("/:sessionId/register", async (req, res)=>{
  res.json({}) 
})





router.get("/:sessionId", validateParams(sessionIdParamSchema), getSessionById);

export default router