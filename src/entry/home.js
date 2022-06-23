import { Router } from 'express'
import { collection } from './utils/mongo.js'

const router = Router()
const users = collection('users')



export default router
