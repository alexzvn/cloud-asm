import { defineRouter } from '../utils/router.js'
import { collection } from '../utils/mongo.js'
import { isError, addIndexes } from '../utils/helper.js'
import { nanoid } from 'nanoid'

const categories = collection('categories')

const validate = async (category) => ({
  name: !category.name || category.name.length < 2 && "Name must be at least 2 characters long",
})

/**
 * @type {import('../utils/route').DefineRouter}
 */
export default defineRouter({
  prefix: '/categories',

  gets: {
    '/': async (req, res) => {
      const { errors, messages, old } = req.session

      res.render('category/index.hbs', {
        errors, messages, old,
        categories: addIndexes(await categories.find().toArray()),
      })
    },

    ':id': async (req, res) => {
      const { errors, messages, old } = req.session

      const category = await categories.findOne({ id: req.params.id })

      if (category === null) {
        return res.redirect('/categories')
      }

      res.render('category/edit.hbs', { category, errors, messages, old })
    },

    ':id/delete': async (req, res) => {
      if (await categories.findOne({ id: req.params.id }) === null) {
        return res.redirect('/categories')
      }

      await categories.deleteOne({ id: req.params.id })

      res.redirect('/categories')
    }
  },

  posts: {
    create: async (req, res) => {

      const validation = await validate(req.body)

      if (isError(validation)) {
        req.session.errors = validation

        return res.redirect('/categories')
      }

      const category = { id: nanoid(), name: req.body.name }

      await categories.insertOne(category)

      res.redirect('/categories')
    },

    ':id/update': async (req, res) => {
      if (await categories.findOne({ id: req.params.id }) === null) {
        req.session.errors.alert = 'Category does not exist'
        return res.redirect('/categories')
      }

      const validation = await validate(req.body)

      if (isError(validation)) {
        req.session.errors = validation

        return res.redirect('/categories')
      }

      await categories.updateOne({ id: req.params.id }, { $set: { name: req.body.name } })

      res.redirect('/categories')
    }
  }
})


