
import { getSession } from "../services/sessions.service.js";

export async function getSessionById(req, res, next) {
  try {
    const session = await getSession(req.params.sessionId);
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
}