import mongoose from "mongoose";
import Double from '@mongoosejs/double';

const Schema = mongoose.Schema
const orderModelSchema = new Schema({

        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: Number, required: true },
        phoneNumber:{ type: Number, required: true },
        country: { type: Double, required: true },
       
        orderItems: [       
            {
              // name: { type: String, required: true },
              quantity: { type: Number, required: true },
              image: { type: String, required: true },
              price: { type: Double, required: true },
              product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
                required: true,
              },
            },
          ]
    

})

export default mongoose.model("OrderModel", orderModelSchema)