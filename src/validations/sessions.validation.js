import { z } from "zod";

export const sessionIdParamSchema = z.object({
  sessionId: z.coerce.number().int().positive()
  
});

export const registerSchema = z.object({
  studentId: z.string().min(1),
});