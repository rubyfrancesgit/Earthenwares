const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const config = require("./config.json");

const User = require("./models/user");
const Product = require("./models/product");

const port = 5000;

app.use((req, res, next) => {
    console.log(`${req.method} request ${req.url}`);
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

app.get('/', (req, res) => res.send('Hello! I am from the backend!'));

mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@cluster0.${config.MONGO_CLUSTER_NAME}.mongodb.net/${config.MONGO_DBNAME}?retryWrites=true&w=majority`, {useNewUrlParser: true})
    .then(() => console.log("DB connected"))
    .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
    });

app.listen(port, () => console.log(`My full stack application is listening on port ${port}`));

// Register user
app.post("/registerUser", (req, res) => {
    // checking if user is already in DB
    User.findOne({username: req.body.username}, (err, userResult) => {
        if (userResult) {
            res.send("Username already taken. Please try another name");
        } else {
            const hash = bcrypt.hashSync(req.body.password); // encrypting user password
            const user = new User({
                _id: new mongoose.Types.ObjectId,
                username: req.body.username,
                email: req.body.password,
                password: hash,
                seller: req.body.seller,
                storeName: req.body.storeName,
                storeDescription: req.body.storeDescription
            }); // end of if/else
            // save to DB and notify userResult
            user.save().then(result => {
                res.send(result);
            }).catch(err => res.send(err));
        }
    }); // end of user check
}); // end of register user

// Login user
app.post("/loginUser", (req, res) => {
    User.findOne({username: req.body.username}, (err, userResult) => {
        if (userResult) {
            if(bcrypt.compareSync(req.body.password, userResult.password)) {
                res.send(userResult);
            } else {
                res.send("Not authorized");
            } // end of inner if statement
        } else {
            res.send("User not found. Please register");
        } // end of outer if statement
    }); // end of find one
}); // end of login