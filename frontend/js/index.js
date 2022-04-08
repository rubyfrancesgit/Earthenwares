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

            $.ajax({
                url: `http://${url}/allProductsFromDB`,
                type: "GET",
                dataType: "json",
                success: function(productsFromMongo) {
                    console.log(productsFromMongo);
    
                    for(let i = 0; i < productsFromMongo.length; i++) {
                        generateShopCard(productsFromMongo, i)
                    }
                },
                error: function() {
                    // alert("Unable to get products");
                }
            });

            $.ajax({
                url: `http://${url}/allUsersFromDB`,
                type: "GET",
                dataType: "json",
                success: function(usersFromMongo) {
                    console.log(usersFromMongo);
                },
                error: function() {
                    // alert("Unable to get users");
                }
            });
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
                            imgThreeUrl,
                            authorId: userId
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

    // ----- shop page start -----

    // reusable code for product cards (is called initially from the first successful ajax function)
    function generateShopCard(productsFromMongo, i) {
        $("#shopContainer").append(
            `
                <a class="shop-card ${productsFromMongo[i].authorId}" id="${productsFromMongo[i]._id}" href"./product-page.html">
                    <img class="card__img" src=${productsFromMongo[i].imgOneUrl} alt="Card image cap" style="width: 15rem;">
                    <div class="card-body">
                        <h5 class="card__heading">${productsFromMongo[i].productName}</h5>
                        <p class="card__p">$${productsFromMongo[i].price}</p>
                    </div>
                </a>
            `
        );

        $(`.${productsFromMongo[i].authorId}`).click(function() {
            console.log(this.id);
            console.log(this.classList[1]);

            let thisUserId = this.classList[1];

            if(this.classList.contains("624e8fcd78f43bdfe0524c8e")) {
                console.log("yes")
            } else {
                console.log("no")
            }

            for(let i = 0; i < productsFromMongo.length; i++) {
                if(productsFromMongo[i]._id === this.id) {
                    $("#productContainer").empty();
                    generateProductSection(productsFromMongo, i);
                }
            }

            $.ajax({
                url: `http://${url}/allUsersFromDB`,
                type: "GET",
                dataType: "json",
                success: function(usersFromMongo) {
                    for(let i = 0; i < usersFromMongo.length; i++) {
                        if(thisUserId === usersFromMongo[i]._id) {
                            console.log("equal");
                            $("#authorContainer").empty();
                            $("#authorContainer").append(
                                `
                                    <p>Store name: ${usersFromMongo[i].storeName}</p>
                                `
                            );
                        }
                    }
                },
                error: function() {
                    alert("Unable to get users");
                }
            });
            
        });
    }

    

    // ----- shop page end -----


    // ----- product page start -----

    function generateProductSection(productsFromMongo, i) {
        let productId = productsFromMongo[i]._id;
        
        $("#commentContainer").empty();

        $("#productContainer").append(
            `
                <div class="card" href="./product-page.html">
                    <img class="card__img" src=${productsFromMongo[i].imgOneUrl} alt="Card image cap" style="width: 10rem;">
                    <div class="card-body">
                        <h5 class="card__heading">${productsFromMongo[i].productName}</h5>
                        <p class="card__p">$${productsFromMongo[i].price}</p>
                    </div>
                </div>

                <input type="text" id="commentField">
                <button id="submitComment" onclick="" value="${productsFromMongo[i]._id}">Submit comment</button>
            `
        );

        // ----- comments start -----

        // Post comment start
        $("#submitComment").click(function() {
            // let productId = document.querySelector("#submitComment").value;
            userId = sessionStorage.getItem('userID');
            let comment = document.querySelector("#commentField").value;
            
            if (!userId) {
                alert("Please login to comment");
            } else {
                $.ajax({
                    url: `http://${url}/createComment`,
                    type: "POST",
                    data: {
                        comment,
                        authorId: userId,
                        productId
                    },
                    success: function(comment) {
                        alert("Comment posted");
                        console.log(comment);
                    },
                    error: function() {
                        alert("Unable to post comment");
                    }
                }); // end of ajax
            } // end of if/else statement
        }); // end of post comment function

        // view comments start
        $.ajax({
            url: `http://${url}/seeComments/${productId}`,
            type: "GET",
            success: function(commentsFromMongo) {
                console.log(commentsFromMongo);
                for (let i = 0; i < commentsFromMongo.length; i++) {
                    if (commentsFromMongo[i].productId === productId) {
                        $("#commentContainer").append(
                            `
                                <p>${commentsFromMongo[i].comment}</p>
                            `
                        );
                    }
                }
            },
            error: function() {
                console.log(productId);
                console.log("Error: cannot retrieve comments");
            } // end of error
        }); // end of ajax
        // end of view comments

        // ----- comments end -----
    }

    // ----- product page end -----


    



}); // end of document.ready


// curving text start