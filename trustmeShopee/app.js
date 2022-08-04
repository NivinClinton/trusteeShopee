import mongoose from 'mongoose'
import express from 'express'
import userRouter from './routes/userRoutes.js'

import dotenv from 'dotenv';
import adminRouter from './routes/adminRoutes.js';


dotenv.config()

const app = express()
app.use(express.json());


// app.use('/admin', adminRouter )
app.use('/user', userRouter )
app.use('/admin', adminRouter)


const url= `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.lkwbno6.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url).then(()=>app.listen(8000)).then(()=>console.log('database connected successfully')).catch(err=>console.log(err))