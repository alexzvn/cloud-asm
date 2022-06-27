import { defineRouter } from '../utils/router.js'
import { collection } from '../utils/mongo.js'
import { isError, isUrl, addIndexes } from '../utils/helper.js'
import { nanoid } from 'nanoid'

const products = collection('products')
const category = collection('categories')

const validate = async (product) => ({
  name: product.name.length < 2 && "Name must be at least 2 characters long",
  price: (!product.price || +product.price) < 0 && "Price must be a positive number",
  category: await category.findOne({ id: product.category }) === null && "Category does not exist",
  image: (!product.image || !isUrl(product.image)) && "Image must be a valid URL",
})

/**
 * @type {import('../utils/route').DefineRouter}
 */
export default defineRouter({
  prefix: '/products',

  gets: {
    '/': async (req, res) => {
      const { errors, messages, old } = req.session

      const max = 20
      const page = isNaN(+req.query.page) ? 0 : +req.query.page

      const prods = await products.find().skip(page * max).limit(max).sort({ _id: 1 }).toArray()
      const cates = await category.find().toArray()

      const paginator = {
        next: prods.length == max,
        prev: page > 0,
        n: page + 1,
        p: page - 1,
      }

      res.render('product/index.hbs', {
        errors, messages, old, paginator,
        categories: cates,
        products: addIndexes(prods).map(prod => {
          const cate = cates.find(c => c.id === prod.category)
          return { ...prod, category: cate ? cate.name : '' }
        }),
      })
    },

    ':id': async (req, res) => {
      const { id } = req.params
      const { errors, messages, old } = req.session

      const product = await products.findOne({ id })
      const cates = (await category.find().toArray()).map(cate => ({ ...cate, selected: cate.id === product.category }))

      if (product === null) {
        return res.redirect('/products')
      }

      res.render('product/edit.hbs', { product, categories: cates, errors, messages, old })
    },

    ':id/delete': async (req, res) => {
      const { id } = req.params

      id && await products.deleteOne({ id })

      res.redirect('/products')
    }
  },

  posts: {
    create: async (req, res) => {
      const body = req.body

      const validation = await validate(req.body)

      if (isError(validation)) {
        req.session.errors = validation
        return res.redirect('/products')
      }

      const product = {
        id: nanoid(),
        name: body.name,
        price: +body.price,
        category: body.category,
        image: body.image,
        description: body.description,
      }

      await products.insertOne(product)
      res.redirect('/products')
    },

    ':id/update': async (req, res) => {
      const body = req.body
      const { id } = req.params

      const product = await products.findOne({ id })

      if (product === null) {
        return res.redirect('/products/' + id)
      }

      const validation = await validate(body)

      if (isError(validation)) {
        req.session.errors = validation
        return res.redirect('/products/' + id)
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

      res.redirect('/products')
    }
  }
})


