console.log("linked");

$(document).ready(function() {
    console.log("document ready");

    let url;
    let userId;

    $('#testClick').click(function(){
        console.log('Clicked');
    })

    // start of initial ajax to get url data from local json
    $.ajax({
        url: "config.json",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        success: function(configData) {
            url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;

            // start of all products from DB ajax
            $.ajax({
                url: `http://${url}/allProductsFromDB`,
                type: "GET",
                dataType: "json",
                success: function(productsFromMongo) {
                    console.log(productsFromMongo);
    
                    for(let i = 0; i < productsFromMongo.length; i++) {
                        generateShopCard(productsFromMongo, i)

                        populateProfileListings(productsFromMongo, i)
                    }
                },
                error: function() {
                    // alert("Unable to get products");
                }
            }); // end of all products from DB ajax

            // start of all users from DB ajax
            $.ajax({
                url: `http://${url}/allUsersFromDB`,
                type: "GET",
                dataType: "json",
                success: function(usersFromMongo) {
                    console.log(usersFromMongo);
                    populateProfile(usersFromMongo);
                },
                error: function() {
                    // alert("Unable to get users");
                }
            }); // end of all users from DB ajax
        },
        error: function(error) {
            console.log(error);
        }
    }); // end of initial ajax to get url data from local json

    // start of sign up
    $("#signUpBtn").click(function() {
        event.preventDefault();

        let username = $("#signUpUsername").val();
        let email = $("#signUpEmail").val();
        let password = $("#signUpPassword").val();
        let profilePicture = $("#signUpProfilePicture").val();
        let seller = document.querySelector('input[name="signUpSeller"]:checked').value;
        let storeName = $("#signUpStoreName").val();
        let storeDescription = $("#signUpStoreDescription").val();
        let instagram = $("#signUpInstagram").val();
        let facebook = $("#signUpFacebook").val();
        let twitter = $("#signUpTwitter").val();

        console.log(username, email, password, seller, storeName, storeDescription, instagram, facebook, twitter);

        if (username == "" || email == "" || password == "") {
            alert("Please enter all fields");
        } else if ((seller == "yes") && (username == "" || email == "" || profilePicture == "" || password == "" || storeName == "" || storeDescription == "")) {
            alert("Please enter all fields, including store fields");
        } else {
            console.log("Form complete");

            // start of register user ajax
            $.ajax({
                url: `http://${url}/registerUser`,
                type: "POST",
                data: {
                    username,
                    email,
                    password,
                    profilePicture,
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
            }); // end of register user ajax
        } // end of if/else checking register form details
    }); // end of sign up

    // start of login
    $("#loginBtn").click(function() {
        console.log("login")
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
        let category = $("#addProductCategory").val();
        let colour = $("#addProductColour").val();
        let dimensions = $("#addProductDimensions").val();
        let dishwasherSafe = $("#addProductDishwasherSafe").val();
        let microwaveSafe = $("#addProductMicrowaveSafe").val();
        
        console.log(productName, description, price, imgOneUrl, imgTwoUrl, imgThreeUrl, category, colour, dimensions, dishwasherSafe, microwaveSafe);
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
                            category,
                            colour,
                            dimensions,
                            dishwasherSafe,
                            microwaveSafe,
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

        // when product card in shop is click, finds the relevant product details
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

                    // calls the function that creates the product section of the product details page
                    generateProductSection(productsFromMongo, i);
                }
            }

            // gets users from mongo to append store information to product details
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
            }); // end of get users ajax
        }); // end of product detail appending
    } // end of generateShopCard function

    // ----- shop page end -----


    // ----- product page start -----

    function generateProductSection(productsFromMongo, i) {
        let productId = productsFromMongo[i]._id;
        
        $("#commentContainer").empty();

        // reusable code creates the product section of the product details page
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


    // ----- profile page start -----

    function populateProfile(usersFromMongo) {
        console.log("populate profile");

        if (sessionStorage.username !== "") {
            

            for(let i = 0; i < usersFromMongo.length; i++) {
                if(sessionStorage.userID === usersFromMongo[i]._id) {
                    const profileCurvedText = document.getElementById("profileCurvedText");

                    if (usersFromMongo[i].seller === true) {
                        profileCurvedText.innerHTML = "SELLER PROFILE."

                        $("#cardBottomBody").append(
                            `
                            <p class="card-artist" id="">${usersFromMongo[i].storeName}</p>
                            `
                        );

                        $("#profileName").append(
                            `
                                <h3 class="artist-name">${usersFromMongo[i].storeName}</h3>
                            `
                        );
                    } else {
                        profileCurvedText.innerHTML = "USER PROFILE."

                        $("#cardBottomBody").append(
                            `
                            <p class="card-artist" id="">${usersFromMongo[i].username}</p>
                            `
                        );

                        $("#profileName").append(
                            `
                                <h3 class="artist-name">${usersFromMongo[i].username}</h3>
                            `
                        );
                    }

                    $("#profileDescription").append(
                        `<p class="artist-about">${usersFromMongo[i].storeDescription}</p>`
                    );

                    $("#profileImgDiv").append(
                        `
                            <img class="artist-img" src=${usersFromMongo[i].profilePicture} alt="store image">
                        `
                    )

                    if(usersFromMongo[i].instagram !== "") {
                        $("#profileInstaDiv").append(
                            `
                                <a class="fa-stack fa-2x" href=${usersFromMongo[i].instagram} target="_blank">
                                    <i class="fa-solid fa-circle fa-stack-2x"></i>
                                    <i class="fa-brands fa-instagram fa-stack-1x fa-inverse"></i>
                                </a>
                            `
                        );
                    }

                    if(usersFromMongo[i].facebook !== "") {
                        $("#profileFacebookDiv").append(
                            `
                                <a class="fa-stack fa-2x" href=${usersFromMongo[i].facebook} target="_blank">
                                    <i class="fa-solid fa-circle fa-stack-2x"></i>
                                    <i class="fa-brands fa-facebook-f fa-stack-1x fa-inverse"></i>
                                </a>
                            `
                        );
                    }

                    if(usersFromMongo[i].twitter !== "") {
                        $("#profileTwitterDiv").append(
                            `
                                <a class="fa-stack fa-2x" href=${usersFromMongo[i].twitter} target="_blank">
                                    <i class="fa-solid fa-circle fa-stack-2x"></i>
                                    <i class="fa-brands fa-twitter fa-stack-1x fa-inverse"></i>
                                </a>
                            `
                        );
                    }
                } // end of is statement checking userId
            } // end of for loop
        } // end of if statement checking user is logged in
    } // end of populateProfile function

    // populate listings on profile
    function populateProfileListings(productsFromMongo, i) {
        console.log(productsFromMongo[i].productName);

        if(sessionStorage.userID === productsFromMongo[i].authorId) {
            console.log(productsFromMongo[i]._id);

            $("#profileListings").append(
                `
                    <div class="card" style="width: 27rem;" data-value=${productsFromMongo[i]._id} id="productID">
                        <div class="edit-btns">
                            <span class="fa-stack fa-2x" value=${productsFromMongo[i]._id} id="editIcon" href="./update-product.html">
                                <i class="fa-solid fa-circle fa-stack-2x"></i>
                                <i class="fa-solid fa-pen-to-square fa-stack-1x fa-inverse"></i>
                            </span>

                            <span class="fa-stack fa-2x" value=${productsFromMongo[i]._id} id="trashIcon" data-bs-toggle="modal" href="#exampleModalToggle4">
                                <i class="fa-solid fa-circle circle-trash fa-stack-2x"></i>
                                <i class="fa-solid fa-trash-can fa-stack-1x fa-inverse"></i>
                            </span>
                        </div>
                        <img class="card-img-top" src=${productsFromMongo[i].imgOneUrl} alt="Card image cap">
                        <div class="card-body">
                        <div class="card-body-top">
                            <p class="card-name">${productsFromMongo[i].productName}</p>
                            <p class="card-price">$${productsFromMongo[i].price}</p>
                        </div>
                        <div class="card-body-bottom" id="cardBottomBody">
                            <p class="card-artist" id=""></p>
                        </div>
                        </div>
                    </div>
                `
            ); // end of profile listings append

            // delete listing function
            $("#trashIcon").click(function() {
                console.log("trash");

                $("#yesDeleteListing").click(function() {
                    console.log("yes delete");
                    const id = $("#productID").data("value");
                    console.log(id)

                    $.ajax({
                        url: `http://${url}/deleteProduct/${id}`,
                        type: "DELETE",
                        success: function() {
                            console.log("Deleted");
                        },
                        error: function() {
                            alert("Error: cannot delete");
                        }
                    });
                });
            }); // end of delete listing function

            // edit listing function
            $("#editIcon").click(function() {
                console.log("edit click");

                document.getElementById("userProfileSection").style.display = "none";
                document.getElementById("editListingSection").style.display = "block";

                document.getElementById("updateProductImgOneUrl").placeholder = `${productsFromMongo[i].imgOneUrl}`;
                document.getElementById("updateProductImgTwoUrl").placeholder = `${productsFromMongo[i].imgTwoUrl}`;
                document.getElementById("updateProductImgThreeUrl").placeholder = `${productsFromMongo[i].imgThreeUrl}`;

                document.getElementById("updateProductName").placeholder = `${productsFromMongo[i].productName}`;

                document.getElementById("updateProductPrice").placeholder = `${productsFromMongo[i].price}`;

                document.getElementById("updateProductImgThreeUrl").placeholder = `${productsFromMongo[i].imgThreeUrl}`;

                document.getElementById("updateProductCategory").value = `${productsFromMongo[i].category}`;

                document.getElementById("updateProductColour").value = `${productsFromMongo[i].colour}`;

                document.getElementById("updateProductDimensions").placeholder = `${productsFromMongo[i].dimensions}`;

                document.getElementById("updateProductDishwasherSafe").value = `${productsFromMongo[i].dishwasherSafe}`;

                document.getElementById("updateProductMicrowaveSafe").value = `${productsFromMongo[i].microwaveSafe}`;

                document.getElementById("updateProductDescription").placeholder = `${productsFromMongo[i].description}`;

                $("#updateProductBtn").click(function() {
                    console.log("update product");
                    event.preventDefault();

                    let productName = $("#updateProductName").val();
                    let description = $("#updateProductDescription").val();
                    let price = $("#updateProductPrice").val();
                    let imgOneUrl = $("#updateProductImgOneUrl").val();
                    let imgTwoUrl = $("#updateProductImgTwoUrl").val();
                    let imgThreeUrl = $("#updateProductImgThreeUrl").val();
                    userId = sessionStorage.getItem('userID');
                    let category = $("#updateProductCategory").val();
                    let colour = $("#updateProductColour").val();
                    let dimensions = $("#updateProductDimensions").val();
                    let dishwasherSafe = $("#updateProductDishwasherSafe").val();
                    let microwaveSafe = $("#updateProductMicrowaveSafe").val();
                    
                    console.log(productName, description, price, imgOneUrl, imgTwoUrl, imgThreeUrl, category, colour, dimensions, dishwasherSafe, microwaveSafe);
                });
            }); // end of edit listing function

            // exit edit listing function, back to user profile
            $("#goBackProfileBtn").click(function() {
                document.getElementById("userProfileSection").style.display = "block";
                document.getElementById("editListingSection").style.display = "none";
            }); // end of exit edit listing function
        }
    } // end of populate listings on profile

    

    // ----- profile page end -----


}); // end of document.ready


// curving text start