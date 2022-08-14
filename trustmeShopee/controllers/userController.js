import user from "../model/user.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { errorRes, successRes } from "../helpers/response_data.js";
import category from "../model/category.js";
import orderModel from "../model/orderModel.js";


dotenv.config()

export const register = async (req, res, next) => {

    const { name, email, phone, password } = req.body;

    if (!(name && email && phone && password)) {
        return res.status(400).send("All input is required");
    }


    let existingUser;

    try {
        existingUser = await user.findOne({ email });
    } catch (err) {
        return console.log(err);
    }

    if (existingUser) {
        return res.status(400).json("User Already Found")
    }
    const hashedPassword = bcrypt.hashSync(password);
    const userDetails = new user({
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
   

    return res.json({data: userDetails, token })
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!(email && password)) {
        return res.status(400).send("All input is required");
    }
    let existingUser;
    try {
        existingUser = await user.findOne({ email });

    } catch (err) {
        return console.log(err);
    }

    if (!existingUser) {
        return res.status(201).send({ message: "User not found" })
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
      
        return res.status(200).json(successRes("login successful", { data: existingUser, token }));
    }
    return res.status(400).json(errorRes("Invalid Creditionals"));
}

export const allCategories = async (req, res) => {
    let categories;
    try {
        categories = await category.find()

    } catch (error) {
        console.log();
    }
    if (!categories) {
        return res.status(500).json({ message: "no products found" })
    }
    return res.json({ categories })
}
export const orderNew = async (req, res) => {
    const { fullName, address,city,postalCode,phoneNumber,country,name,quantity,image,price,product } = req.body
    const userId = req.params.id

    const orderDetails = new orderModel(
        {
            fullName,
            address,
            city,
            postalCode,
            phoneNumber,
            country,
            orderItems:[]
        }
    )
    try {
        const itemDetails ={
            name,quantity,image,price,product
        }
         orderDetails.orderItems.push(itemDetails)
        
    } catch (error) {
        
    }
    try {
       
        await orderDetails.save()     

    } catch (error) {
        console.log(error);
    }

    if (!orderDetails) {
        return res.status(500).json({ message: "unable to add address" })
    }
    return res.json({ message: "address added successfully", data: orderDetails })

}
export const viewOrder = async(req,res)=>{
    const orderId = req.params.id;
    let orderDetail;
    try {
        orderDetail = await orderModel.findById(orderId)
    } catch (error) {
        console.log(error);
    }
    if(!orderDetail){
        return res.status(500).json({message:"unable to find the order"})
    }
    return res.json({orderDetail})
}