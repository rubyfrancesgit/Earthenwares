const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    comment: String,
    initial: String,
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    date: Date,
    isArtist: Boolean
});

module.exports = mongoose.model("Comment", commentSchema);