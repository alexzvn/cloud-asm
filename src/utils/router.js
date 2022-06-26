import { Router } from 'express'
import { join } from 'path'

const routes = []

const consume = (method = '', ...path) => {
  path = join('/', ...path)

  const color = {
    GET: '\x1b[32m%s\x1b[0m',
    POST: "\x1b[33m%s\x1b[0m",
    PUT: "\x1b[34m%s\x1b[0m",
    DELETE: "\x1b[35m%s\x1b[0m",
  }[method.toLocaleUpperCase()] ?? '\x1b[0m%s'

  routes.push([path, color, `${method.toUpperCase()} ........... ${path}`])
}

/**
 * @param {import("./route").RouterConfig} config
 */
export const defineRouter = (config) => {
  const router = Router()

  const { init, middleware, gets, posts, puts, deletes, prefix } = config

  init && router.use(init)

  if (middleware) {
    Array.isArray(middleware) ? middleware.forEach(m => router.use(m)) : router.use(middleware)
  }

  /**
   * @param {import("./route").Method?} method 
   */
  const mapper = (method, register, type = 'GET') => {
    if (!method) return

    for (const [path, handler] of Object.entries(method)) {
      const handlers =  Array.isArray(handler) ? handler : [handler]

      register(join(prefix, path), ...handlers)

      consume(type, prefix, path)
    }
  }

  mapper(gets, (path, ...handler) => router.get(path, ...handler), 'GET ')
  mapper(posts, (path, ...handler) => router.post(path, ...handler), 'POST')
  mapper(puts, (path, ...handler) => router.post(path, ...handler), 'PUT ')
  mapper(deletes, (path, ...handler) => router.post(path, ...handler), 'DEL ')

  return router
}

export const log = () => {
  for (const [_, color, uri] of routes) [
    console.log(color, uri)
  ]
}
