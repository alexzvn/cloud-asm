import 'dotenv/config'
import express from 'express'
import { engine } from 'express-handlebars'
import router from './src/router.js'

const app = express()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))

app.use('/', router)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://0.0.0.0:${process.env.PORT}`)
})
