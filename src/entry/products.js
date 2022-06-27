import { defineRouter } from '../utils/router.js'
import { collection } from '../utils/mongo.js'
import { isError, isUrl } from '../utils/helper.js'
import { nanoid } from 'nanoid'

const products = collection('products')
const category = collection('categories')

const validate = async (product) => ({
  name: product.name.length < 2 && "Name must be at least 2 characters long",
  price: !product.price || +product.price < 0 && "Price must be a positive number",
  category: await category.findOne({ id: product.category }) === null && "Category does not exist",
  image: !isUrl(product.image) && "Image must be a valid URL",
})

/**
 * @type {import('../utils/route').DefineRouter}
 */
export default defineRouter({
  prefix: '/products',

  gets: {
    '/': async (req, res) => {
      const { errors, messages, old } = req.session

      res.render('product/index.hbs', {
        errors, messages, old,
        products: await products.find().toArray(),
        categories: await category.find().toArray(),
      })
    },

    ':id': async (req, res) => {
      const { id } = req.params
      const { errors, messages, old } = req.session

      const product = await products.findOne({ id })

      if (product === null) {
        req.session.errors.alert = 'Product does not exist'
        return res.redirect('/products')
      }

      res.render('product/edit.hbs', { product, errors, messages, old })
    }
  },

  posts: {
    create: async (req, res) => {
      const body = req.body

      const validation = await validate(body)

      if (isError(validation)) {
        req.session.errors = validation

        console.log(validation);

        return res.redirect('/products')
      }

      const product = {
        id: nanoid(),
        name,
        price: +price,
        category,
        image,
        description
      }

      await products.insertOne(product)

      req.session.messages.alert = 'Product created'

      res.redirect('/products')
    },

    ':id': async (req, { redirect }) => {
      const body = req.body
      const { id } = req.params

      const product = await products.findOne({ id })

      if (product === null) {
        req.session.errors.alert = 'Product does not exist'
        return redirect('/products')
      }

      const validation = await validate(body)

      if (isError(validation)) {
        req.session.errors = validation
        return redirect('/products')
      }

      await products.updateOne({ id }, {
        $set: {
          name: body.name,
          price: +body.price,
          category: body.category,
          image: body.image,
          description: body.description
        }
      })

      req.session.messages.alert = 'Product updated'

      res.redirect('/products')
    }
  }
})


