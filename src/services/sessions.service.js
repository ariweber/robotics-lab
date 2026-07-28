import { sessionRepo } from "../DAL/sessions.dal.js";
import { createError } from "../utils/createError.js";

export async function getSession(id) {
  const session = await sessionRepo.getById(id);
  if (!session) throw createError(404, "Session not found");
  const registeredCount = await sessionRepo.countRegistrations(id);
  return {
    ...session,
    registeredCount,
    remainingSpots: session.capacity - registeredCount,
  };
}
