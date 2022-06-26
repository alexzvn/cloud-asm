import { client } from "./utils/mongo.js"

/**
 * 
 * @param {import('express').Express} app 
 */
export const setup = async (app) => {
  await client.connect()

  console.log('Connected to MongoDB')

  const routers = await Promise.all( [
    import('./entry/auth.js')
  ])

  app.all('/*', (req, _, next) => {
    req.app.locals.layout = 'main'
    next()
  })

  for (const [prefix, router] of routers) {
    app.use(prefix, router)
  }
}
