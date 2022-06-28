import { defineRouter } from '../utils/router.js'
import { collection } from '../utils/mongo.js'

const products = collection('products')

/**
 * @type {import('../utils/route').DefineRouter}
 */
export default defineRouter({
  prefix: '/',

  gets: {
    '/': async (req, res) => {
      const items = req.query.search ?
        await products.find({ name: { $regex: req.query.search, $options: 'i' } }).toArray() :
        await products.find().toArray()

      res.render('index.hbs', { products: items, search: req.query.search })
    }
  }
})
