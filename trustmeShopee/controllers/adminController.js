import admin from "../model/admin.js";

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { errorRes, successRes } from "../helpers/response_data.js";
import category from "../model/category.js";

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
    const {categoryName  } = req.body

    const categoryDetails = new category({
       categoryName
    })
    try {
        await categoryDetails.save();
    } catch (err) {
        return console.log(err);
    }
    return res.status(200).json({data:categoryDetails})

}

export const getCategory =async(req,res)=>{
    let categories;
    try {
        categories = await category.find();
      } catch (err) {
        console.log(err);
      }

      if(!categories){
        return res.status(400).json("categories not found")
      }
      return res.json({categories})
}

export const updateCategory = async(req,res)=>{
    const {categoryName} = req.body
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

export const deleteCategory =async(req,res)=>{
    const categoryId = req.params.id
    let categoryName;
    try {
        categoryName = await category.findByIdAndRemove(categoryId)
           
      } catch (err) {
        console.log(err);
      }
      if(!categoryName){
        return res.status(500).json("unable to delete")
      }
    return res.json("Category deleted")

}