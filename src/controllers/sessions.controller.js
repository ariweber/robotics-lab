
import { getSession, registerStudent, searchSessions } from "../services/sessions.service.js";

export async function search(req, res, next) {
  try {
    const sessions = await searchSessions(req.validatedQuery);
    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
}

export async function getSessionById(req, res, next) {
  try {
    const session = await getSession(req.params.sessionId);
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
}

export async function register(req, res, next) {
  try {
    const result = await registerStudent(req.params.sessionId, req.body.studentId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}