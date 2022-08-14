import mongoose from "mongoose";

const Schema = mongoose.Schema
const userAddressSchema = new Schema({

    buildingNo: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: true
    },
    streetName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    }

})

export default mongoose.model("UserAddress", userAddressSchema)