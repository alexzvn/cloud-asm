import { defineRouter } from '../utils/router.js'

/**
 * @type {import('../utils/route').DefineRouter}
 */
export default defineRouter({
  prefix: '/',

  gets: {
    '/': (req, res) => res.render('index.hbs')
  }
})
