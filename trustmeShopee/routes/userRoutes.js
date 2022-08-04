import express from 'express'
import { login, register } from '../controllers/userController.js'
import verifyToken from '../middleware/auth.js'

const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post("/welcome", verifyToken, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
  });

export default userRouter