import mongoose from "mongoose";

const Schema = mongoose.Schema
const productCategorySchema = new Schema({
    productName:{
        type : String,
        required: true,
        
    },
    productPrice:{
        type : String,
        required: true,
        
    },
    productDescription:{
        type : String,
        required: true,
        
    },
    productImage:{
        type : String,
        required: true,
        
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref :"SubCategory",
        required: true
      }
})

export default mongoose.model("ProductsCategory", productCategorySchema)