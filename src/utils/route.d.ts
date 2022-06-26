import { RequestHandler, Router } from 'express'

export interface Method {
  [path: string]: RequestHandler[] | RequestHandler
}

export interface RouterConfig {
  prefix: string
  init?: (router: Router) => any
  middleware?: RequestHandler[],
  gets?: Method
  posts?: Method
  // puts: Method
  // deletes: Method
  // all: Method
}

export interface DefineRouter {
  (config: RouterConfig): Router
}
