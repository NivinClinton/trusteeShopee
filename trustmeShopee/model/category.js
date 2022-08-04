import mongoose from "mongoose";

const Schema = mongoose.Schema
const createCategorySchema = new Schema({
    categoryName:{
        type : String,
        required: true
    }
})

export default mongoose.model("Category", createCategorySchema)