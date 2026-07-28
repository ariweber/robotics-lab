import { db } from "../DB/mongoDB.js";
import { ObjectId } from "mongodb";

const usersCollection = db.collection("users");

async function createUsers(users) {
  try {
    return await usersCollection.insertMany(users);
  } catch (error) {
    console.log(error);
  }
}

async function createUser(user) {
  try {
    return await usersCollection.insertMany(user);
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(id) {
  try {
    return await usersCollection.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.log(error);
  }
}

export async function countUsersBySessionId(sessionId) {
  try {
    return await usersCollection.countDocuments({
      labSessionsIds: Number(sessionId),
    });
  } catch (e) {
    console.log(e);
  }
}


const a = await getUserById("6a68a689b609f4eca6c4933f")
console.log(a);
