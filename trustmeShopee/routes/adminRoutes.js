import express from 'express'
import { adminLogin, adminRegister, createCategory, createProducts, createSubCategory, deleteCategory, deleteProducts, deleteSubCategory, getCategory, getProducts, getSubCategory, updateCategory, updateProducts, updateSubCategory } from '../controllers/adminController.js'
import verifyToken from '../middleware/auth.js'

const adminRouter = express.Router()

//register, login
adminRouter.post('/register', adminRegister)
adminRouter.post('/login', adminLogin)

//category
adminRouter.post('/createcategory',verifyToken, createCategory)
adminRouter.get('/getcategory',verifyToken, getCategory)
adminRouter.put('/updatecategory/:id',verifyToken, updateCategory)
adminRouter.delete('/deletecategory/:id',verifyToken, deleteCategory)

//subCategory
adminRouter.post('/createsubcategory/:id',verifyToken, createSubCategory)
adminRouter.get('/getsubcategory/:id',verifyToken, getSubCategory)
adminRouter.put('/updatesubcategory/:id',verifyToken, updateSubCategory)
adminRouter.delete('/deletesubcategory/:id',verifyToken, deleteSubCategory)

//products
adminRouter.post('/createproducts/:id',verifyToken, createProducts)
adminRouter.get('/getproducts/:id',verifyToken, getProducts)
adminRouter.put('/updateproducts/:id',verifyToken, updateProducts)
adminRouter.delete('/deleteproducts/:id',verifyToken, deleteProducts)



export default adminRouter