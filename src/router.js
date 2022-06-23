import { Router } from "express"

const router = Router()

router.all('/*', (req, _, next) => {
  req.app.locals.layout = 'main'

  next()
})

router.get('/', (req, res) => {
  res.render('index.hbs', {
    title: 'Home',
    message: 'Hello World!',
  })
})

export default router
