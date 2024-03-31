import express from 'express'
import UserController from '../controller/user.js'
import Auth from '../utils/Auth.js'
const router = express.Router()
router.post('/',UserController.createRequest)



export default router