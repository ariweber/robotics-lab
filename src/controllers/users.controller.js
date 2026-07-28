import { addUser, getUser } from "../services/users.service.js";

export async function createUser(req, res, next) {
  try {
    const id = await addUser(req.body);
    res.status(201).json({ id });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await getUser(req.params.userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}
