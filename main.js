import 'dotenv/config'
import express from 'express'
import { engine } from 'express-handlebars'
import { setup } from './src/entry.js'

const app = express()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))

const start = () => app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://0.0.0.0:${process.env.PORT}`)
})


setup(app).then(start)
