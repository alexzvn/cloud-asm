import { client } from "./utils/mongo.js"
import home from "./entry/home.js"
import auth from './entry/auth.js'

/**
 * 
 * @param {import('express').Express} app 
 */
export const setup = async (app) => {
  console.log('Connecting ......... MongoDB')

  await client.connect()

  console.log('Connected to MongoDB')

  app.all('/*', (req, _, next) => {
    req.app.locals.layout = 'main'
    next()
  })


  app.use(home)
  app.use(auth)
}
