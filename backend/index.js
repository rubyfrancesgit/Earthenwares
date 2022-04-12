const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const config = require("./config.json");

const User = require("./models/user");
const Product = require("./models/product");
const Comment = require("./models/comment");
const product = require("./models/product");

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
                profilePicture: req.body.profilePicture,
                seller: req.body.seller,
                storeName: req.body.storeName,
                storeDescription: req.body.storeDescription,
                instagram: req.body.instagram,
                facebook: req.body.facebook,
                twitter: req.body.twitter
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

// Add product to DB
app.post("/addProduct", (req, res) => {
    const dbProduct = new Product({
        _id: new mongoose.Types.ObjectId,
        productName: req.body.productName,
        description: req.body.description,
        price: req.body.price,
        imgOneUrl: req.body.imgOneUrl,
        imgTwoUrl: req.body.imgTwoUrl,
        imgThreeUrl: req.body.imgThreeUrl,
        authorId: req.body.authorId,
        category: req.body.category,
        colour: req.body.colour,
        dimensions: req.body.dimensions,
        dishwasherSafe: req.body.dishwasherSafe,
        microwaveSafe: req.body.microwaveSafe,
    });

    dbProduct.save().then(result => {
        res.send(result);
    }).catch(err => res.send(err));
}); // end of add product to DB

// update product
app.patch("/updateProduct/:id", (req, res) => {
    const idParam = req.params.id;
    Product.findById(idParam, (err, product) => {
        const updatedProduct = {
            productName: req.body.productName,
            description: req.body.description,
            price: req.body.price,
            imgOneUrl: req.body.imgOneUrl,
            imgTwoUrl: req.body.imgTwoUrl,
            imgThreeUrl: req.body.imgThreeUrl,
            authorId: req.body.authorId,
            category: req.body.category,
            colour: req.body.colour,
            dimensions: req.body.dimensions,
            dishwasherSafe: req.body.dishwasherSafe,
            microwaveSafe: req.body.microwaveSafe,
        }
        Product.updateOne({_id:idParam}, updatedProduct)
            .then(result => {
                res.send(result);
            }).catch(err => res.send(err));
    }); // end of find by id
}); // end of update product

// get all products from DB
app.get("/allProductsFromDB", (req, res) => {
    Product.find().then(result => {
        res.send(result);
    });
}); // end of get all products from DB

// Delete product from DB
app.delete("/deleteProduct/:id", (req, res) => {
    const idParam = req.params.id;
    Product.findOne({_id: idParam}, (err, product) => {
        if(product) {
            Product.deleteOne({_id: idParam}, err => {
                console.log("Deleted on backend");
            });
        } else {
            alert("Not found");
        }
    }).catch(err => res.send(err));
});

// get all users from DB
app.get("/allUsersFromDB", (req, res) => {
    User.find().then(result => {
        res.send(result);
    });
}); // end of get all products from DB


// ----- comments backend start -----

// Post comment start
app.post("/createComment", (req, res) => {
    const newComment = new Comment({
        _id: new mongoose.Types.ObjectId,
        comment: req.body.comment,
        date: new Date(),
        authorId: req.body.authorId,
        productId: req.body.productId
    });
    newComment.save()
    .then(result => {
        Product.findByIdAndUpdate(
            newComment.productId,
            {$push: {comment: newComment}}
        ).then(result => {
            res.send(newComment);
        }).catch(err => {
            res.send(err);
        });
    });
}); // Post comment end

// View comments
app.get("/seeComments/:productId", (req, res) => {
    Comment.find().then(result => {
        res.send(result);
    });
});

// ----- comments backend start -----