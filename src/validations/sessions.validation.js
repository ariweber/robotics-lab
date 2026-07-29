import { z } from "zod";

export const sessionIdParamSchema = z.object({
  sessionId: z.coerce.number().int().positive()
  
});

export const registerSchema = z.object({
  studentId: z.string().min(1),
});

export const searchSessionsQuerySchema = z.object({
  topic: z.string().trim().min(1).optional(),
  capacity: z.coerce.number().int().positive().optional(),
});