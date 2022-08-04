import express from 'express'
import { adminLogin, adminRegister, createCategory, deleteCategory, getCategory, updateCategory } from '../controllers/adminController.js'
import verifyToken from '../middleware/auth.js'

const adminRouter = express.Router()

adminRouter.post('/register', adminRegister)
adminRouter.post('/login', adminLogin)
adminRouter.post('/createcategory', createCategory)
adminRouter.get('/getcategory', getCategory)
adminRouter.put('/updatecategory/:id', updateCategory)
adminRouter.delete('/deletecategory/:id', deleteCategory)



export default adminRouter