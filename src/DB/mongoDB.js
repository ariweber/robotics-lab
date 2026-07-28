import {MongoClient} from "mongodb"
import "dotenv/config"


const client = new MongoClient(process.env.MONGO_URL);


try {
  await client.connect()
  console.log("mongo connected")
} catch (error) {
  console.log(error.message)
}

export const db = client.db("project")