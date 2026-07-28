import { sessionRepo } from "../DAL/sessions.dal.js";
import { createError } from "../utils/createError.js";
import { userRepo } from "../DAL/users.dal.js";

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

export async function registerStudent(sessionId, studentId) {
  const user = await userRepo.getById(studentId);
  if (!user) throw createError(404, "Student not found");
  const session = await sessionRepo.getById(sessionId);
  if (!session) throw createError(404, "Session not found");
  const alreadyRegistered = await sessionRepo.isRegistered(
    sessionId,
    studentId,
  );
  if (alreadyRegistered) throw createError(409, "Student already registered");
  const registeredCount = await sessionRepo.countRegistrations(sessionId);
  if (registeredCount >= session.capacity) {
    const error = createError(409, "Session is full");
    error.remainingSpots = 0;
    throw error;
  }

  await sessionRepo.addRegistration(sessionId, studentId);
  try {
    await userRepo.addSessionToUser(studentId, sessionId);
  } catch (error) {
    await sessionRepo.removeRegistration(sessionId, studentId);
    throw createError(500, "Registration failed, rolled back");
  }
  return { remainingSpots: session.capacity - registeredCount - 1 };
}
