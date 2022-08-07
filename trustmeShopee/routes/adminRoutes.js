import express from 'express'
import { adminLogin, adminRegister, createCategory, createProducts, createSubCategory, deleteCategory, deleteProducts, deleteSubCategory, getCategory, getProducts, getSubCategory, updateCategory, updateProducts, updateSubCategory } from '../controllers/adminController.js'
import verifyToken from '../middleware/auth.js'

const adminRouter = express.Router()

//register, login
adminRouter.post('/register', adminRegister)
adminRouter.post('/login', adminLogin)

//category
adminRouter.post('/createcategory', createCategory)
adminRouter.get('/getcategory', getCategory)
adminRouter.put('/updatecategory/:id', updateCategory)
adminRouter.delete('/deletecategory/:id', deleteCategory)

//subCategory
adminRouter.post('/createsubcategory', createSubCategory)
adminRouter.get('/getsubcategory', getSubCategory)
adminRouter.put('/updatesubcategory/:id', updateSubCategory)
adminRouter.delete('/deletesubcategory/:id', deleteSubCategory)

//products
adminRouter.post('/createproducts', createProducts)
adminRouter.get('/getproducts', getProducts)
adminRouter.put('/updateproducts/:id', updateProducts)
adminRouter.delete('/deleteproducts/:id', deleteProducts)



export default adminRouter