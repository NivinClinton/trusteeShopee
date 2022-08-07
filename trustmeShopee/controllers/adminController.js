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

    const categoryDetails = new category({
        categoryName,
        subCategories: []
    })
    try {
        await categoryDetails.save();
    } catch (err) {
        return console.log(err);
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
    let categoryNaming;
    try {
        categoryNaming = await category.findByIdAndUpdate(categoryId, {
            categoryName
        });
    } catch (err) {
        console.log(err);
    }
    if (!categoryNaming) {
        return res.status(500).json({ message: "unable to find categoryName" });
    }
    return res.status(200).json({ categoryNaming });
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
    const { subCategoryName, categoryId } = req.body
    let existingCategory;
    try {
        existingCategory = await category.findById(categoryId);
    } catch (err) {
        return console.log(err);
    }

    const subCategoryDetails = new subCategory({
        subCategoryName,
        categoryId,
        Products:[]
    })
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await subCategoryDetails.save({ session });
        existingCategory.subCategories.push(subCategoryDetails);
        await existingCategory.save({ session });
        await session.commitTransaction();
    } catch (err) {
        
        return res.status(500).json({ message: err })
    }
    return res.status(200).json({ data: subCategoryDetails })
}


export const getSubCategory = async (req, res) => {
    let subCategories;
    try {
        subCategories = await subCategory.find();
    } catch (err) {
        console.log(err);
    }

    if (!subCategories) {
        return res.status(400).json("subCategories not found")
    }
    return res.json({ subCategories })

}
export const updateSubCategory = async (req, res) => {
    const { subCategoryName } = req.body
    const categoryId = req.params.id
    let subCategoryNaming;
    try {
        subCategoryNaming = await subCategory.findByIdAndUpdate(categoryId, {
            subCategoryName
        });
    } catch (err) {
        console.log(err);
    }
    if (!subCategoryNaming) {
        return res.status(500).json({ message: "unable to find subCategoryName" });
    }
    return res.status(200).json({ subCategoryNaming });
}
export const deleteSubCategory = async (req, res) => {
    const subCategoryId = req.params.id
    let subCategoryName;
    try {
        subCategoryName = await subCategory.findByIdAndRemove(subCategoryId).populate('categoryId');
        await subCategoryName.categoryId.subCategories.pull(subCategoryName);
        await subCategoryName.categoryId.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json(errorRes("unable to delete"))
    }
    
    return res.json(successRes("subCategory deleted"))

}

export const createProducts =async(req,res)=>{
    const { productName,productPrice,productDescription,productImage,categoryId } = req.body

    let existingSubCategory;
    try {
        existingSubCategory = await subCategory.findById(categoryId);
    } catch (err) {
        return console.log(err);
    }


    const productDetails = new productCategory({
        productName,
        productPrice,
        productDescription,
        productImage,
        categoryId
    })
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await productDetails.save({ session });
        existingSubCategory.Products.push(productDetails);
        await existingSubCategory.save({ session });
        await session.commitTransaction();
    } catch (err) {
        
        return res.status(500).json({ message: err })
    }
    return res.status(200).json({ data: productDetails })

}
export const getProducts =async(req,res)=>{
    let products;
    try {
        products = await productCategory.find();
    } catch (err) {
        console.log(err);
    }

    if (!products) {
        return res.status(400).json("products not found")
    }
    return res.json({ products })
}
export const updateProducts =async(req,res)=>{
    const { productName, productPrice, productDescription, productImage } = req.body
    const categoryId = req.params.id
    let product;
    try {
        product = await productCategory.findByIdAndUpdate(categoryId, {
            productName,
            productPrice,
            productDescription,
            productImage
        });
    } catch (err) {
        console.log(err);
    }
    if (!product) {
        return res.status(500).json({ message: "unable to find product" });
    }
    return res.status(200).json({ product });
}
export const deleteProducts =async(req,res)=>{
    const productId = req.params.id
    let product;
    try {
        product = await productCategory.findByIdAndRemove(productId).populate('categoryId');
        await product.categoryId.Products.pull(product);
        await product.categoryId.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json(errorRes("unable to delete"))
    }
    
    return res.json(successRes("product deleted"))
}