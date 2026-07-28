import { userRepo } from "../DAL/users.dal.js";
import { createError } from "../utils/createError.js";

export async function addUser(newUser) {
  const userExists = await userRepo.getByFullName(
    newUser.firstName,
    newUser.lastName
  );
  if (userExists) throw createError(409, "User already exists");
  return userRepo.create(newUser);
}

export async function getUser(userId) {
  const user = await userRepo.getById(userId);
  if (!user) throw createError(404, "User not found");
  return user;
}
