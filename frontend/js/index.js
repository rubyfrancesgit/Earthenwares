console.log("linked");

$(document).ready(function() {
    console.log("document ready");

    let url;
    let userId;

    $.ajax({
        url: "config.json",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        success: function(configData) {
            url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
        },
        error: function(error) {
            console.log(error);
        }
    }); // end of first ajax

    // start of sign up
    $("#signUpBtn").click(function() {
        event.preventDefault();

        let username = $("#signUpUsername").val();
        let email = $("#signUpEmail").val();
        let password = $("#signUpPassword").val();
        let seller = document.querySelector('input[name="signUpSeller"]:checked').value;
        let storeName = $("#signUpStoreName").val();
        let storeDescription = $("#signUpStoreDescription").val();
        let instagram = $("#signUpInstagram").val();
        let facebook = $("#signUpFacebook").val();
        let twitter = $("#signUpTwitter").val();

        console.log(username, email, password, seller, storeName, storeDescription, instagram, facebook, twitter);

        if (username == "" || email == "" || password == "") {
            alert("Please enter all fields");
        } else if ((seller == "yes") && (username == "" || email == "" || password == "" || storeName == "" || storeDescription == "")) {
            alert("Please enter all fields, including store fields");
        } else {
            console.log("Form complete");
            $.ajax({
                url: `http://${url}/registerUser`,
                type: "POST",
                data: {
                    username,
                    email,
                    password,
                    seller,
                    storeName,
                    storeDescription,
                    instagram,
                    facebook,
                    twitter
                },
                success: function(user) {
                    console.log(user); // remove later
                    if (user !== "Username already taken. Please try another name") {
                        alert("Thanks for signing up! Please login.");

                        // clearning inputs
                        $("#signUpUsername").val("");
                        $("#signUpEmail").val("");
                        $("#signUpPassword").val("");
                    } else {
                        alert('Username already taken. Please use a different username');

                        // clearning inputs
                        $("#signUpUsername").val("");
                        $("#signUpEmail").val("");
                        $("#signUpPassword").val("");
                    } // end of if/else
                }, // end of success
                error: function() {
                    console.log("Cannot call api");
                }
            }); // end of ajax
        } // end of if/else
    }); // end of sign up

    $("#loginBtn").click(function() {
        event.preventDefault();

        let username = $("#loginUsername").val();
        let password = $("#loginPassword").val();

        console.log(username, password);

        if (username == "" || password == "") {
            alert("Please enter all details");
        } else {
            $.ajax({
                url: `http://${url}/loginUser`,
                type: "POST",
                data: {
                    username,
                    password
                },
                success: function(user) {
                    console.log(user) // remove later
                    if (user == "User not found. Please register") {
                        alert("User not found. Please register");
                    } else if (user == "Not authorized") {
                        alert("Please try again with the correct details");

                        // clearing inputs
                        $("#loginUsername").val("");
                        $("#loginPassword").val("");
                    } else {
                        alert("Logged in");

                        // storing logged-in user's details
                        sessionStorage.setItem("userID", user["_id"]);
                        sessionStorage.setItem("username", user["username"]);
                        sessionStorage.setItem("userEmail", user["email"]);

                        // clearing inputs
                        $("#loginUsername").val("");
                        $("#loginPassword").val("");
                    } // end of inner if/else
                } // end of success
            }); // end of ajax
        } // end of outer if/else
    }); // end of login

    // Start of sign out
    $("#signOutBtn").click(function() {
        sessionStorage.clear();
        alert('You have logged out');
        console.log(sessionStorage);
    }); // end of sign out

    // add product to DB
    $("#addProductBtn").click(function() {
        event.preventDefault();

        let productName = $("#addProductName").val();
        let description = $("#addProductDescription").val();
        let price = $("#addProductPrice").val();
        let imgOneUrl = $("#addProductImgOneUrl").val();
        let imgTwoUrl = $("#addProductImgTwoUrl").val();
        let imgThreeUrl = $("#addProductImgThreeUrl").val();
        userId = sessionStorage.getItem('userID');
        
        console.log(productName, description, price, imgOneUrl, imgTwoUrl, imgThreeUrl);
        if(!userId) {
            alert("Sign in to add product")
        } else {
            if(isNaN(price) == true) {
                alert("Price must be a number");
            } else if (isNaN(price) == false) {
                if (productName == "" || description == "" || price == "" && (imgOneUrl == "" && imgTwoUrl == "" && imgThreeUrl == "")) {
                    alert("Please login and enter all fields");
                } else {
                    $.ajax({
                        url: `http://${url}/addProduct`,
                        type: "POST",
                        data: {
                            productName,
                            description,
                            price,
                            imgOneUrl,
                            imgTwoUrl,
                            imgThreeUrl
                        },
                        success: function(product) {
                            console.log(product);
                            alert("Product added");
        
                            $("#addProductName").val("");
                            $("#addProductDescription").val("");
                            $("#addProductPrice").val("");
                            $("#addProductImgOneUrl").val("");
                            $("#addProductImgTwoUrl").val("");
                            $("#addProductImgThreeUrl").val("");
                        },
                        error: function() {
                            console.log("Error: cannot call api");
                        }
                    }); // end of ajax
                } // end of info fields if/else statement
            } // end of price is number if/else statement
        } // end of userId if/else statement
    }); // end of add product to DB

    // view products from DB
    $("#viewProductsBtn").click(function() {
        $.ajax({
            url: `http://${url}/allProductsFromDB`,
            type: "GET",
            dataType: "json",
            success: function(productsFromMongo) {
                console.log(productsFromMongo);
            },
            error: function() {
                alert("Unable to get products");
            }
        });
    }); // end of view products

}); // end of document.ready


// curving text start