import mongoose from "mongoose";

const Schema = mongoose.Schema
const createCategorySchema = new Schema({
    categoryName: {
        type: String,
        required: true
    },
    subCategories: [
        {
            subCategoryName: {
                type: String,
                required: true
            },
            products: [{
                productName: {
                    type: String,
                    required: true,

                },
                productPrice: {
                    type: String,
                    required: true,

                },
                productDescription: {
                    type: String,
                    required: true,

                },
                productImage: {
                    type: String,
                    required: true,

                },
            }
            ]

        }]
    // ,


    // subCategories:[{type: mongoose.Types.ObjectId, ref: "SubCategory", required: true}]
    // subCategories: [{ type: Schema.Types.Mixed, ref: "SubCategory", required: true }]
})

export default mongoose.model("Category", createCategorySchema)