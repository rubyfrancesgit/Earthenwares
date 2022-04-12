$(document).ready(function() {
    let url;
    let userId;

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
                    for(let i = 0; i < productsFromMongo.length; i++) {
                        generateShopCard(productsFromMongo, i)

                        populateProfileListings(productsFromMongo, i)
                    }
                },
                error: function() {
                    alert("Unable to get products");
                }
            }); // end of all products from DB ajax

            // start of all users from DB ajax
            $.ajax({
                url: `http://${url}/allUsersFromDB`,
                type: "GET",
                dataType: "json",
                success: function(usersFromMongo) {
                    populateProfile(usersFromMongo);
                },
                error: function() {
                    alert("Unable to get users");
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

                <a class="cards ${productsFromMongo[i].authorId}" id="${productsFromMongo[i]._id}">
                        <div class="cards__img">
                            <img src=${productsFromMongo[i].imgOneUrl} alt="Card image cap" class="cards-img">
                        </div>
                        <div class="cards__body">
                            <div class="cards__body-top">
                                <p class="cards__body-name">${productsFromMongo[i].productName}</p>
                                <p class="cards__body-price">$${productsFromMongo[i].price}</p>
                            </div>
                            <div class="cards__body-bottom">
                                <p class="cards__body-artist">Jane Doe</p>
                            </div>
                        </div>
                    </a>
            `
        );

        // THE FOLLOWING COMMENTS CONTAINS THE OLD CARD DESIGN IN CASE IT'S  NEEDED

                //         <a class="card ${productsFromMongo[i].authorId}" id="${productsFromMongo[i]._id}" href"./product-page.html">
                //     <img class="card-img-top" src=${productsFromMongo[i].imgOneUrl} alt="Card image cap" style="width: 15rem;">
                //     <div class="card-body">
                //         <div class="card-body-top">
                //             <p class="card-name">${productsFromMongo[i].productName}</p>
                //             <p class="card-price">$${productsFromMongo[i].price}</p>
                //         </div>
                //         <div class="card-body-bottom">
                //             <p class="card-artist">Jane Doe</p>
                //         </div>
                //     </div>
                // </a>
                
        // END OF OLD CARD DESIGN

        // when product card in shop is click, finds the relevant product details
        $(`.${productsFromMongo[i].authorId}`).click(function() {
            console.log(this.id);
            console.log(this.classList[1]);

            let thisUserId = this.classList[1];

            document.getElementById("productSection").style.display = "none";
            document.getElementById("productDetails").style.display = "block";

            $("#productBackBtn").click(function() {
                document.getElementById("productSection").style.display = "block";
                document.getElementById("productDetails").style.display = "none";
            })

            // if(this.classList.contains("624e8fcd78f43bdfe0524c8e")) {
            //     console.log("yes")
            // } else {
            //     console.log("no")
            // }

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
                            generateAuthorProductSection(usersFromMongo, i);
                            // $("#authorContainer").empty();
                            // $("#authorContainer").append(
                            //     `
                            //         <p>Store name: ${usersFromMongo[i].storeName}</p>
                            //     `
                            // );
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

    function generateAuthorProductSection(usersFromMongo, i) {
        $("#artistUpper").empty();
        $("#artistBio").empty();

        $("#artistUpper").append(
            `
                <img class="artist-img" src=${usersFromMongo[i].profilePicture}>
                <div class="artist-detail">
                    <h3 class="artist-name">${usersFromMongo[i].storeName}</h3>
                    <button class="view-profile" id="viewSellerProfile">VIEW SELLER PROFILE<i class="fa-solid fa-arrow-right-long"></i></button>
                </div>
            `
        );

        $("#artistBio").append(
            `
                <p>${usersFromMongo[i].storeDescription}</p>
            `
        );

        if(usersFromMongo[i].instagram !== "") {
            $("#productDetailsInstaDiv").empty();
            $("#productDetailsInstaDiv").append(
                `
                    <a class="fa-stack fa-2x" href=${usersFromMongo[i].instagram} target="_blank">
                        <i class="fa-solid fa-circle fa-stack-2x"></i>
                        <i class="fa-brands fa-instagram fa-stack-1x fa-inverse"></i>
                    </a>
                `
            );
        }

        if(usersFromMongo[i].facebook !== "") {
            $("#productDetailsFacebookDiv").empty();
            $("#productDetailsFacebookDiv").append(
                `
                    <a class="fa-stack fa-2x" href=${usersFromMongo[i].facebook} target="_blank">
                        <i class="fa-solid fa-circle fa-stack-2x"></i>
                        <i class="fa-brands fa-facebook-f fa-stack-1x fa-inverse"></i>
                    </a>
                `
            );
        }

        if(usersFromMongo[i].twitter !== "") {
            $("#productDetailsTwitterDiv").empty();
            $("#productDetailsTwitterDiv").append(
                `
                    <a class="fa-stack fa-2x" href=${usersFromMongo[i].twitter} target="_blank">
                        <i class="fa-solid fa-circle fa-stack-2x"></i>
                        <i class="fa-brands fa-twitter fa-stack-1x fa-inverse"></i>
                    </a>
                `
            );
        }

        $("#viewSellerProfile").click(function() {
            console.log('clicked');
            document.getElementById("productDetails").style.display = "none";
            document.getElementById("artistProfile").style.display = "block";
            const profileCurvedText = document.getElementById("artistProfileCurvedText");

            $("#cardBottomBody").append(
                `
                <p class="card-artist" id="">${usersFromMongo[i].storeName}</p>
                `
            );

            $("#artistProfileName").append(
                `
                    <h3 class="artist-name">${usersFromMongo[i].storeName}</h3>
                `
            );

            $("#artistProfileDescription").append(
                `<p class="artist-about">${usersFromMongo[i].storeDescription}</p>`
            );

            $("#artistProfileImgDiv").append(
                `
                    <img class="artist-img" src=${usersFromMongo[i].profilePicture} alt="store image">
                `
            );

            if(usersFromMongo[i].instagram !== "") {
                $("#artistProfileInstaDiv").append(
                    `
                        <a class="fa-stack fa-2x" href=${usersFromMongo[i].instagram} target="_blank">
                            <i class="fa-solid fa-circle fa-stack-2x"></i>
                            <i class="fa-brands fa-instagram fa-stack-1x fa-inverse"></i>
                        </a>
                    `
                );
            }

            if(usersFromMongo[i].facebook !== "") {
                $("#artistProfileFacebookDiv").append(
                    `
                        <a class="fa-stack fa-2x" href=${usersFromMongo[i].facebook} target="_blank">
                            <i class="fa-solid fa-circle fa-stack-2x"></i>
                            <i class="fa-brands fa-facebook-f fa-stack-1x fa-inverse"></i>
                        </a>
                    `
                );
            }

            if(usersFromMongo[i].twitter !== "") {
                $("#artistProfileTwitterDiv").append(
                    `
                        <a class="fa-stack fa-2x" href=${usersFromMongo[i].twitter} target="_blank">
                            <i class="fa-solid fa-circle fa-stack-2x"></i>
                            <i class="fa-brands fa-twitter fa-stack-1x fa-inverse"></i>
                        </a>
                    `
                );
            }
        });
    }

    function generateProductSection(productsFromMongo, i) {
        let productId = productsFromMongo[i]._id;
        
        $("#commentContainer").empty();
        $("#productImages").empty();
        $("#productInfo").empty();
        $("#artistProfileListings").empty();

        // appending images on product detail page
        $("#productImages").append(
            `
                <div class="images-left">
                    <img class="product-img-one" src=${productsFromMongo[i].imgOneUrl}>
                    <img class="product-img-two" src=${productsFromMongo[i].imgTwoUrl}>
                    <img class="product-img-three" src=${productsFromMongo[i].imgThreeUrl}>
                </div>
                <div class="images-right">
                    <img class="main-image" src=${productsFromMongo[i].imgOneUrl}>
                </div>
            `
        );

        // appending product info on product detail page
        $("#productInfo").append(
            `
                <h6 class="type">${productsFromMongo[i].category}</h6>
                <h3 class="product-name">${productsFromMongo[i].productName}</h3>
                <h6 class="artist-name">Artist Name</h6>
                <h6 class="price">$${productsFromMongo[i].price}</h6>

                <p class="info">${productsFromMongo[i].description}</p>
            `
        );

        // THIS CODE ONLY ADDS SELECTED PRODUCT - needs fixing
        $("#artistProfileListings").append(
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

        //---------------------------------- new code ends ----------------------------
        //---------------------------------- old code starts ----------------------------

        // ----- comments start -----

        $("#addCommentBtn").click(function() {
            console.log("clicked");
            userId = sessionStorage.getItem('userID');
            // $("#commentModal").modal("show");

            if (!userId) {
                alert("Please login to comment");
            } else {
                $("#commentModal").modal("show");
            }
        });

        // Post comment start
        $("#submitComment").click(function() {
            let productId = productsFromMongo[i]._id;
            userId = sessionStorage.getItem('userID');
            let comment = document.querySelector("#commentField").value;
            let username = sessionStorage.getItem('username');
            let initial = username.charAt(0);
            let isArtist;
            if(productsFromMongo[i].authorId === sessionStorage.userID) {
                isArtist = true;
            } else {
                isArtist = false;
            }
            console.log(productsFromMongo[i].authorId);
            console.log(sessionStorage.userID);

            
            if (!userId) {
                alert("Please login to comment");
            } else {
                $.ajax({
                    url: `http://${url}/createComment`,
                    type: "POST",
                    data: {
                        comment,
                        initial,
                        authorId: userId,
                        productId,
                        isArtist
                    },
                    success: function(comment) {
                        console.log(comment);
                        alert("Comment posted");
                        document.querySelector("#commentField").value = "";
                        $("#commentModal").modal("hide");
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
                for (let i = 0; i < commentsFromMongo.length; i++) {
                    if (commentsFromMongo[i].productId === productId) {
                        if(commentsFromMongo[i].isArtist === true) {
                            $("#commentContainer").append(
                                `
                                    <div class="reply-container">
                                        <div class="rounded-circle seller">
                                            <p class="initials">${commentsFromMongo[i].initial}</p>
                                        </div>
                                        <div class="reply">
                                        ${commentsFromMongo[i].comment}
                                        </div>
                                    </div>
                                `
                            );
                        } else {
                            $("#commentContainer").append(
                                `
                                    <div class="comment-container">
                                        <div class="rounded-circle commenter">
                                            <p class="initials">${commentsFromMongo[i].initial}</p>
                                        </div>
    
                                        <div class="comment">
                                            <p>${commentsFromMongo[i].comment}</p>
                                        </div>
                                    </div>
                                `
                            );
                        }
                    }
                }
            },
            error: function() {
                console.log("Error: cannot retrieve comments");
            } // end of error
        }); // end of ajax
        // end of view comments

        // ----- comments end -----
    }

    // ----- product page end -----


    // ----- profile page start -----

    function populateProfile(usersFromMongo) {
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
                        $("#profileInstaDiv").empty();
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
                        $("#profileFacebookDiv").empty();
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
                        $("#profileTwitterDiv").empty();
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

        if(sessionStorage.userID === productsFromMongo[i].authorId) {
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
                $("#yesDeleteListing").click(function() {
                    const id = $("#productID").data("value");

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

                document.getElementById("userProfileSection").style.display = "none";
                document.getElementById("editListingSection").style.display = "block";

                // setting form details to relevant product details
                document.getElementById("updateProductImgOneUrl").value = `${productsFromMongo[i].imgOneUrl}`;
                document.getElementById("updateProductImgTwoUrl").value = `${productsFromMongo[i].imgTwoUrl}`;
                document.getElementById("updateProductImgThreeUrl").value = `${productsFromMongo[i].imgThreeUrl}`;
                document.getElementById("updateProductName").value = `${productsFromMongo[i].productName}`;
                document.getElementById("updateProductPrice").value = `${productsFromMongo[i].price}`;
                document.getElementById("updateProductImgThreeUrl").value = `${productsFromMongo[i].imgThreeUrl}`;
                document.getElementById("updateProductCategory").value = `${productsFromMongo[i].category}`;
                document.getElementById("updateProductColour").value = `${productsFromMongo[i].colour}`;
                document.getElementById("updateProductDimensions").value = `${productsFromMongo[i].dimensions}`;
                
                if (productsFromMongo[i].dishwasherSafe === true) {
                    document.getElementById("updateProductDishwasherSafe").value = "yes";
                } else {
                    document.getElementById("updateProductDishwasherSafe").value = "no";
                }

                if (productsFromMongo[i].microwaveSafe === true) {
                    document.getElementById("updateProductMicrowaveSafe").value = "yes";
                } else {
                    document.getElementById("updateProductMicrowaveSafe").value = "no";
                }

                document.getElementById("updateProductDescription").value = `${productsFromMongo[i].description}`;

                $("#updateProductBtn").click(function() {
                    event.preventDefault();

                    const id = $("#productID").data("value");
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

                    $.ajax({
                        url:`http://${url}/updateProduct/${id}`,
                        type: "PATCH",
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
                            microwaveSafe
                        },
                        success: function(updatedProduct) {
                            $("#updateModal").modal("show");

                            $("#updateOkay").click(function() {
                                document.getElementById("userProfileSection").style.display = "block";
                                document.getElementById("editListingSection").style.display = "none";
                                $("#updateModal").modal("hide");
                                $(window).scrollTop(0);
                            })
                        },
                        error: function() {
                            alert("Error: cannot update");
                        }
                    }); // end of ajax
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