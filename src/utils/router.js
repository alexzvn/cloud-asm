import { Router } from 'express'

/**
 * 
 * @param {import("./route").Method?} method 
 */
const mapper = (method, register) => {
  if (!method) return

  for (const [path, handler] of Object.entries(method)) {
    Array.isArray(handler) ? register(path, ...handler) : register(path, handler)
  }
}

/**
 * @param {import("./route").RouterConfig} config
 */
export const defineRouter = (config) => {
  const router = Router()

  const { init, middleware, gets, posts, prefix } = config

  init && router.use(init)

  if (middleware) {
    Array.isArray(middleware) ? middleware.forEach(m => router.use(m)) : router.use(middleware)
  }

  mapper(gets, (path, ...handler) => router.get(path, ...handler))
  mapper(posts, (path, ...handler) => router.post(path, ...handler))

  return [prefix, router]
}
