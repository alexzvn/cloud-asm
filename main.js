import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import { engine } from 'express-handlebars'
import { setup } from './src/entry.js'
import { nanoid } from 'nanoid'
import { ErrorRefresh, InputRefresh } from './src/utils/session.js'

const app = express()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')

app.use(session({
  secret: process.env.APP_KEY || 'secret',
  resave: true,
  saveUninitialized: true,
  genid: (req) => nanoid(),
}))

app.use(express.static('public'))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(ErrorRefresh)
  .use(InputRefresh)

const start = () => app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://0.0.0.0:${process.env.PORT}`)
})

setup(app).then(start)
