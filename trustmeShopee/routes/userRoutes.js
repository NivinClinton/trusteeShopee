import express from 'express'
import { allCategories, login, orderNew, register, viewOrder } from '../controllers/userController.js'
import verifyToken from '../middleware/auth.js'

const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
// userRouter.post("/welcome", verifyToken, (req, res) => {
//     res.status(200).send("Welcome 🙌 ");
//   });
 userRouter.get('/allCategories', allCategories)
 userRouter.post('/ordernew',verifyToken, orderNew)
 userRouter.get('/vieworder/:id',verifyToken, viewOrder)




export default userRouter