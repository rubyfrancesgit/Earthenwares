const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    email: String,
    password: String,
    seller: Boolean,
    storeName: String,
    description: String,
    instagram: String,
    facebook: String,
    twitter: String
});

module.exports = mongoose.model('User', userSchema);