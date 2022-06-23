import { Router } from "express"
import { client } from "./utils/mongo.js"

const router = Router()

router.all('/*', (req, _, next) => {
  req.app.locals.layout = 'main'

  next()
})

/**
 * 
 * @param {import('express').Express} app 
 */
export const setup = async (app) => {
  await client.connect()

  console.log('Connected to MongoDB');

  app.use('/', router)
}
