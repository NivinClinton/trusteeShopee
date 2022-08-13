import admin from "../model/admin.js";

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { errorRes, successRes } from "../helpers/response_data.js";
import category from "../model/category.js";
import subCategory from "../model/subCategory.js";
import mongoose from "mongoose";
import productCategory from "../model/product_category.js";

dotenv.config()

export const adminRegister = async (req, res) => {

    const { name, email, phone, password } = req.body;

    if (!(name && email && phone && password)) {
        return res.status(400).json(errorRes("All input is required"));
    }


    let existingUser;

    try {
        existingUser = await admin.findOne({ email });
    } catch (err) {
        return console.log(err);
    }

    if (existingUser) {
        return res.status(400).json(errorRes("User Already Exist"))
    }
    const hashedPassword = bcrypt.hashSync(password);
    const userDetails = new admin({
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword
    })

    try {
        await userDetails.save();
    } catch (err) {
        return console.log(err);
    }

    const token = jwt.sign(
        { user_id: userDetails._id, email },
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );
    userDetails.token = token;

    return res.json({ userDetails })
}

export const adminLogin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!(email && password)) {
        return res.status(400).json("All input is required");
    }
    let existingUser;
    try {
        existingUser = await admin.findOne({ email });

    } catch (err) {
        return console.log(err);
    }

    if (!existingUser) {
        return res.status(201).json({ message: "User not found" })
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordCorrect || !existingUser) {
        return res.status(400).json(errorRes("Invalid Creditionals"));
    }

    if (existingUser && isPasswordCorrect) {
        const token = jwt.sign(
            { user_id: existingUser._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        // save user token
        existingUser.token = token;
        return res.status(200).json(successRes("login successful", { data: existingUser }));
    }
    return res.status(400).json(errorRes("Invalid Creditionals"));
}


export const createCategory = async (req, res) => {

    const { categoryName } = req.body

    const categoryDetails = new category(req.body)
    try {
        await categoryDetails.save();
    } catch (err) {
        console.log(err);
        return res.status(400).json("unable to create category")
    }
    return res.status(200).json({ data: categoryDetails })

}

export const getCategory = async (req, res) => {
    let categories;
    try {
        categories = await category.find();
    } catch (err) {
        console.log(err);
    }

    if (!categories) {
        return res.status(400).json("categories not found")
    }
    return res.json({ categories })
}

export const updateCategory = async (req, res) => {
    const { categoryName } = req.body
    const categoryId = req.params.id
    let categoryNameChange;
    try {
        categoryNameChange = await category.findByIdAndUpdate(categoryId, {
            categoryName
        });
    } catch (err) {
        console.log(err);
    }
    if (!categoryNameChange) {
        return res.status(500).json({ message: "unable to find categoryName" });
    }
    return res.status(200).json({ categoryNameChange });
}

export const deleteCategory = async (req, res) => {
    const categoryId = req.params.id
    let categoryName;
    try {
        categoryName = await category.findByIdAndRemove(categoryId)

    } catch (err) {
        console.log(err);
    }
    if (!categoryName) {
        return res.status(500).json("unable to delete")
    }
    return res.json("Category deleted")

}

export const createSubCategory = async (req, res) => {
    const { subCategoryName } = req.body
    const categoryId = req.params.id
    let subCategories;
    try {
        subCategories = await category.findOneAndUpdate({ "_id": categoryId },
            {
                "$push":
                {
                    "subCategories":
                    {
                        "subCategoryName": subCategoryName

                    }
                }
            }
        )
      
    } catch (err) {
        console.log(err);
    }

    if (!subCategories) {
        return res.status(400).json("subCategories not found")
    }
    return res.json({ subCategories })

}
export const getSubCategory = async (req, res) => {
    const subCategoryId = req.params.id;
    let categories;
    let locSubCategory;
    try {
        categories = await category.find()

        for (var i = 0; i < categories.length; i++) {
            for (var j = 0; j < categories[i].subCategories.length; j++) {
                var subCategory = categories[i].subCategories[j]
                if (subCategory._id == subCategoryId) {
                    locSubCategory = subCategory;
                    break;
                }
            }

        }
    } catch (error) {
        console.log(error);

    }
    if (!locSubCategory) {
        return res.status(400).json("subCategories not found")
    }
    return res.json({ locSubCategory })

}
export const updateSubCategory = async (req, res) => {
    const { categoryName, subCategoryName } = req.body

    const categoryId = req.params.id
    let subCategoryNameChange;
    try {
        subCategoryNameChange = await category.updateOne({
            "categoryName": categoryName,
            "subCategories._id": categoryId
        }, {
            "$set": {
                "subCategories.$.subCategoryName":
                    subCategoryName
            }
        });
    } catch (err) {
        console.log(err);
    }
    if (!subCategoryNameChange) {
        return res.status(500).json({ message: "unable to find subcategoryName" });
    }
    return res.status(200).json({ message : "subcategoryName updated" });
}

export const deleteSubCategory = async (req, res) => {
    const subCategoryId = req.params.id
    let subCategoryName;
    try {
        subCategoryName = await category.findOneAndUpdate({ "subCategories._id": subCategoryId },
            { $pull: { subCategories: { _id: subCategoryId } } },
            { new: true, useFindAndModify: false })
    } catch (err) {
        console.log(err);
    }

    if (!subCategoryName) {
        return res.status(500).json("unable to delete")
    }

    return res.json(successRes("subCategory deleted"))

}

export const createProducts = async (req, res) => {
    const { productName, productPrice, productDescription, productImage } = req.body
    const categoryId = req.params.id

    let existingSubCategory;
    try {
        existingSubCategory = await category.findOneAndUpdate({ "subCategories._id": categoryId },
            {
                "$push":
                {
                    "subCategories.$.products":
                    {
                        "productName": productName,
                        "productPrice": productPrice,
                        "productDescription": productDescription,
                        "productImage": productImage
                    }
                }
            }
        )
        console.log(existingSubCategory)
    } catch (err) {
        return console.log(err);
    }
    if (!existingSubCategory) {
        return res.status(400).json("subCategories not found")
    }
    return res.json({ existingSubCategory })

}
export const getProducts = async (req, res) => {
    const productId = req.params.id
    let categories;
    let locProduct;
   
    try {
        categories = await category.find().lean()

        for (var i = 0; i < categories.length; i++) {
            for (var j = 0; j < categories[i].subCategories.length; j++) {
                var subCategory = categories[i].subCategories[j];
                for (var z = 0; z < subCategory.products.length; z++) {
                    var product = subCategory.products[z];
                    if (product._id == productId) {
                        locProduct = product;
                        break;
                    }
                }
            }
        }

        if (!locProduct) return res.json((errorRes("Product not found")))
        return res.json(successRes("Product Fetched Successfully", locProduct))

    } catch (err) {
        console.log(err);
    }

    
    
}
export const updateProducts = async (req, res) => {
    const {productName,productPrice,productDescription,productImage,subCategoryId,productId}= req.body
    const categoryId = req.params.id;
    let product;
    try {
        product = await category.updateOne(
            {
               
                "_id": categoryId
            },            
            {
                "$set": {
                    "subCategories.$[subCat].products.$[prod].productName": productName,
                    "subCategories.$[subCat].products.$[prod].productPrice":productPrice,
                    "subCategories.$[subCat].products.$[prod].productDescription": productDescription,
                    "subCategories.$[subCat].products.$[prod].productImage": productImage
                }
            },
            {
                "multi": false,
                "upsert": false,
                arrayFilters: [
                  {
                    "subCat._id": {
                      "$eq":subCategoryId
                    }
                  },
                  {
                    "prod._id": {
                      "$eq":productId
                    }
                  }
                ]
              }
        )
 
    } catch (err) {
        console.log(err);
    }
    if (!product) {
        return res.status(500).json({ message: "unable to find product" });
    }
    return res.status(200).json({ product });
}
export const deleteProducts = async (req, res) => {

    const { subCategoryName } = req.body;
    const productId = req.params.id
    let product;
    
    try {
        product = await category.findOneAndUpdate({ "subCategories.subCategoryName": subCategoryName },

            { $pull: { "subCategories.$.products": { _id: productId } } })

    } catch (err) {

        console.log(err);

        return res.status(500).json(errorRes("unable to delete"))
    }

    return res.json(successRes("product deleted"))
}