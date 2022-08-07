import mongoose from "mongoose";

const Schema = mongoose.Schema
const createCategorySchema = new Schema({
    categoryName:{
        type : String,
        required: true
    },
    // subCategories:[{type: mongoose.Types.ObjectId, ref: "SubCategory", required: true}]
    subCategories:[{type: Schema.Types.Mixed, ref: "SubCategory", required: true}]
})

export default mongoose.model("Category", createCategorySchema)