import { Express } from 'express'
import { ObjectId } from 'mongodb'

type Input = {
  [key: string]: string
}

declare module 'express-session' {
  interface SessionData {
    user: {
      _id: ObjectId
      name: string
      username: string
      password: string
    },

    /**
     * Save old input in session
     */
    old: Input,

    /**
     * request valid if not contain any error
     */
    error: boolean

    /**
     * Flash message in session
     */
    messages: {
      [key: string]: string
    }

    /**
     * Save old input in session
     */
    errors: {
      [key: string]: string
    }
  }
}
