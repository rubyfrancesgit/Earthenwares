const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productName: String,
    description: String,
    price: Number,
    imgOneUrl: String,
    imgTwoUrl: String,
    imgThreeUrl: String,
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    category: String,
    colour: String,
    dimensions: String,
    dishwasherSafe: Boolean,
    microwaveSafe: Boolean
});

module.exports = mongoose.model("Product", productSchema);