import { MongoClient } from "mongodb"

const dsn = process.env.MONGO_DSN || "mongodb://localhost:27017"

const database = process.env.MONGO_DATABASE || "test"

export const client = new MongoClient(dsn, { useNewUrlParser: true })

/**
 * @param {string} name 
 */
export const collection = (name) => client.db(database).collection(name)
