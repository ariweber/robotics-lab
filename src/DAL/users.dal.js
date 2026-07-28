import { db } from "../DB/mongoDB.js";
import { ObjectId } from "mongodb";

const usersCollection = db.collection("users");

async function createUser(user) {
  const result = await usersCollection.insertOne({
    ...user,
    labSessionsIds: [],
  });
  return result.insertedId.toString();
}

async function getUserById(id) {
  if (!ObjectId.isValid(id)) return null;
  const user = await usersCollection.findOne({ _id: new ObjectId(id) });
  if (!user) return null;
  const { _id, ...rest } = user;
  return { id: _id.toString(), ...rest };
}

async function countUsersBySessionId(sessionId) {
  return usersCollection.countDocuments({ labSessionsIds: sessionId });
}

async function getUserByFullName(firstName, lastName) {
  return usersCollection.findOne({ firstName, lastName });
}

export const userRepo = {
  create: createUser,
  getById: getUserById,
  countBySessionId: countUsersBySessionId,
  getByFullName: getUserByFullName,
};
