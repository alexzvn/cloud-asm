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
      res.render('index.hbs', {
        products: new Array(40).fill(await products.findOne())
        // products: await products.find().sort({ _id: 1 }).toArray(),
      })
    }
  }
})
