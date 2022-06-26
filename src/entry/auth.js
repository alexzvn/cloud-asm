import { collection } from '../utils/mongo'
import { genSalt, compare, hash } from 'bcrypt'
import { defineRouter } from '../utils/router'

const users = collection('users')

/**
 * @type {import('express').RequestHandler}
 */
export const Authenticated = (req, res, next) => {
  const { user } = req.session

  if (! user) return next(new Error('Unauthorized'))

  if (! await users.findOne({ _id: user._id })) {
    req.session.destroy()
    return next(new Error('Unauthorized'))
  }

  next()
}

/**
 * @type {import('express').RequestHandler}
 */
export const Unauthenticated = (req, res, next) => {
  req.session.user ? res.redirect('/') : next()
}

/**
 * @type {import('../utils/route').DefineRouter}
 */
export default defineRouter({
  gets: {
    login: (req, res) => res.render('auth/login'),
    register: (req, res) => res.render('auth/register'),
  },

  posts: {
    login: async (req, res) => {
      const { username, password } = req.body
      const error = { error: 'Invalid username or password' }

      const user = await users.findOne({ username })

      if (! user || ! await compare(password, user.password)) {
        return res.render('auth/login', error)
      }

      req.session.user = user

      res.redirect('/')
    },

    register: async (req, res) => {
      let { username, password, name } = req.params

      const errors = {
        name: !name && name.length < 3 && 'Username must be at least 3 characters',
        username: !username && username.length < 2 && "Username must be at least 2 characters long",
        password: !password && password.length < 6 && "Password must be at least 6 characters long",
        username: await users.findOne({ username }) && "Username is already taken",
      }

      if (errors.username || errors.password || errors.name) {
        req.session.errors = errors
        res.redirect('/register')
        return
      }

      password = await hash(password, await genSalt())

      const user = await users.insertOne({ username, password, name })

      req.session.user = { _id: user.insertedId, name, username, password }

      res.redirect('/')
    },

    logout: async (req, res) => {
      req.session.destroy()

      req.session.regenerate(() => res.redirect('/'))

      res.redirect('/')
    },
  }
})
