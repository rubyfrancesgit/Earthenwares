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