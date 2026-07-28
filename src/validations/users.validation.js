import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().trim().min(2),

  lastName: z.string().trim().min(2),

  className: z.string().trim().min(1),
});


