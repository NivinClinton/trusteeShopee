import mongoose from "mongoose";

const Schema = mongoose.Schema
const createSubCategorySchema = new Schema({
    subCategoryName:{
        type : String,
        required: true,
        
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref :"Category",
        required: true
      },
      Products:[{
        type: Schema.Types.Mixed,
        ref: "ProductsCategory", 
        required: true

      }]
})

export default mongoose.model("SubCategory", createSubCategorySchema)