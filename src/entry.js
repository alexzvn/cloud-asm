import { readdir } from 'fs/promises'
import { dirname, resolve } from "path"
import hbs from 'hbs'
import { client } from "./utils/mongo.js"

hbs.registerPartials(resolve('./views/partials'))
const entries = dirname('./src/entry/entry')

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

  const files = await Promise.all(
    (await readdir(entries)).map(file => import(`./entry/${file}`))
  )

  for (const file of files ) {
    app.use(file.default)
  }
}
