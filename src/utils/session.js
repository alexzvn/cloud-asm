
/**
 * @type {import('express').RequestHandler}
 */
export const ErrorRefresh = (req, res, next) => {
  const errors = req.session.errors || {}

  req.session.error = Object.entries(errors).length === 0

  next()
  req.session.errors = {}
}

/**
 * @type {import('express').RequestHandler}
 */
export const InputRefresh = (req, _, next) => {
  next()
  req.session.input = req.params
}
