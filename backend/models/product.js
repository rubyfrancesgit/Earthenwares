const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    storeName: {
        type: mongoose.Schema.Types.String,
        ref: "User"
    },
    productName: String,
    description: String,
    price: Number,
    imgOneUrl: String,
    imgTwoUrl: String,
    imgThreeUrl: String
});