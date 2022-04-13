$(document).ready(function() {
    let url;
    let userId;

        // mobile nav

        $("#hamburgerNav").on("click", function(){
            $(".hamburger-menu").toggle()
        })



        // Start of grab to scroll section home page

            // const ele = document.getElementById('landingProductsCards');
            // ele.style.cursor = 'grab';

            // let pos = { top: 0, left: 0, x: 0, y: 0 };

            // const mouseDownHandler = function (e) {
            //     ele.style.cursor = 'grabbing';
            //     ele.style.userSelect = 'none';

            //     pos = {
            //         left: ele.scrollLeft,
            //         top: ele.scrollTop,
            //         // Get the current mouse position
            //         x: e.clientX,
            //         y: e.clientY,
            //     };

            //     document.addEventListener('mousemove', mouseMoveHandler);
            //     document.addEventListener('mouseup', mouseUpHandler);
            // };

            // const mouseMoveHandler = function (e) {
            //     // How far the mouse has been moved
            //     const dx = e.clientX - pos.x;
            //     const dy = e.clientY - pos.y;

            //     // Scroll the element
            //     ele.scrollTop = pos.top - dy;
            //     ele.scrollLeft = pos.left - dx;
            // };

            // const mouseUpHandler = function () {
            //     ele.style.cursor = 'grab';
            //     ele.style.removeProperty('user-select');

            //     document.removeEventListener('mousemove', mouseMoveHandler);
            //     document.removeEventListener('mouseup', mouseUpHandler);
            // };

            // // Attach the handler
            // ele.addEventListener('mousedown', mouseDownHandler);


// End of grab to scroll section home page

    // Alert Modal Function Begins

    function alertModal(message){
        $("#exampleModalToggle9").modal("show").empty().append(
            `
            <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal__background">
            <div class="modal-header">
                <!-- <h5 class="modal-title" id="exampleModalToggleLabel2">Modal 2</h5> -->
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="modal-body">
                    <div class="modal-heading">
                        <p class="modal-subtitle">${message}</p>
                    </div>
                    <div class="delete">
                        <div class="delete__btns">
                            <button class="delete-btn-alt" data-bs-dismiss="modal" aria-label="Close">Okay</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <div class="form__footer"></div>
            </div>
            </div>
            </div>
        </div>
            `
        );
    }

    // Alert Modal Function Ends
 
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
                    generateHomeCard(productsFromMongo)
                    generateShopCard(productsFromMongo);
                    populateProfileListings(productsFromMongo);
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
                    populateProfile(usersFromMongo);
                },
                error: function() {
                    // alert("Unable to get users");
                }
            }); // end of all users from DB ajax
        },
        error: function(error) {
            let message = error; 
            alertModal(message); 
        }
    }); // end of initial ajax to get url data from local json

    // start of user profile btn click
    $("#indexUserProfile").click(function() {
        let userId = sessionStorage.getItem('userID');

        if(!userId) {
            $("#indexLoginModal").modal("show");
        } else {
            window.location = "./profile.html";
        }
    }); // end of user profile btn click

    // Beginning of Image Preview
    function imagePreview(){

            // Image preview in sign up form starts
        $('#imgPreviewBtnModal').click(function(event){
            event.preventDefault();
            let profilePicture = $("#signUpProfilePicture").val();
                $(".form__image-preview").empty().css("background", `url(${profilePicture})`).css("background-size", "cover").css("background-repeat", "no-repeat").css("background-position-x", "center");
            })// Image preview in sign up form ends

            // Image preview in sign up form starts
        $('#imgPreviewBtnUploadOne').click(function(event){
            event.preventDefault();
            let imgPreviewOne = $("#addProductImgOneUrl").val();

                $("#uploadImageBoxOne").empty().css("background", `url(${imgPreviewOne})`).css("background-size", "cover").css("background-repeat", "no-repeat").css("background-position-x", "center");

            })// Image preview in sign up form ends

            // Image preview in sign up form starts
        $('#imgPreviewBtnUploadTwo').click(function(event){
            event.preventDefault();
            let imgPreviewTwo = $("#addProductImgTwoUrl").val();
                $("#uploadImageBoxTwo").empty().css("background", `url(${imgPreviewTwo})`).css("background-size", "cover").css("background-repeat", "no-repeat").css("background-position-x", "center");

            })// Image preview in sign up form ends

        $('#imgPreviewBtnUploadThree').click(function(event){

            event.preventDefault();

            let imgPreviewThree = $("#addProductImgThreeUrl").val();
                $("#uploadImageBoxThree").empty().css("background", `url(${imgPreviewThree})`).css("background-size", "cover").css("background-repeat", "no-repeat").css("background-position-x", "center");
    
                })// Image preview in sign up form ends
    } // Imape Preview function ends

    imagePreview(); // Calling image preview fucntion


    // start of hiding and showing sign-up buttons depending on whether user is seller
    $("#yesSellerRadio").click(function() {
        let signUpBtnCont = document.getElementById("signUpBtnCont");
        signUpBtnCont.classList.remove("hide");

        let signUpBtn = document.getElementById("signUpBtn");
        signUpBtn.classList.add("hide");
    });

    $("#noSellerRadio").click(function() {
        let signUpBtn = document.getElementById("signUpBtn");
        signUpBtn.classList.remove("hide");

        let signUpBtnCont = document.getElementById("signUpBtnCont");
        signUpBtnCont.classList.add("hide");
    });
    // end of hiding and showing sign-up buttons depending on whether user is seller

    // --- start of sign up ---
    $("#createAccountBtn").click(function() {
        signUpFunction();
    });

    
    $("#signUpBtn").click(function() {
        signUpFunction();

    });

    function signUpFunction() {
        event.preventDefault();

        let username = $("#signUpUsername").val();
        let email = $("#signUpEmail").val();
        let password = $("#signUpPassword").val();
        let profilePicture = $("#signUpProfilePicture").val();
        let seller = $('input[name="signUpSeller"]:checked').val();
        let storeName = $("#signUpStoreName").val();
        let storeDescription = $("#signUpStoreDescription").val();
        let instagram = $("#signUpInstagram").val();
        let facebook = $("#signUpFacebook").val();
        let twitter = $("#signUpTwitter").val();


        imagePreview();

        if (username == "" || email == "" || password == "") {
            // alert("Please enter all fields");
            let message = "Please enter all fields!" ;
            alertModal(message); 
        } else if ((seller == "yes") && (username == "" || email == "" || profilePicture == "" || password == "" || storeName == "" || storeDescription == "")) {
            let message = "Please enter all fields, including store fields!" ;
            alertModal(message); 
        } else {
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
                        let message = "Thanks for signing up! Please login!";
                        alertModal(message); 
                        $("#exampleModalToggle3").modal("hide");

                        // clearning inputs
                        $("#signUpUsername").val("");
                        $("#signUpEmail").val("");
                        $("#signUpPassword").val("");
                    } else {
                        let message = "Username already taken. Please use a different username!";
                        alertModal(message); 

                        // clearning inputs
                        $("#signUpUsername").val("");
                        $("#signUpEmail").val("");
                        $("#signUpPassword").val("");
                    } // end of if/else
                }, // end of success
                error: function() {
                    let message = "Cannot call api";
                    alertModal(message); 
                }
            }); // end of register user ajax
        } // end of if/else checking register form details
    } // --- end of sign up ---

    // start of login
    $("#loginBtn").click(function() {
        event.preventDefault();

        let username = $("#loginUsername").val();
        let password = $("#loginPassword").val();

        if (username == "" || password == "") {
            // alert("Please enter all details");
            let message = "Please enter all details!";
            alertModal(message);
        } else {
            // start of login user ajax
            $.ajax({
                url: `http://${url}/loginUser`,
                type: "POST",
                data: {
                    username,
                    password
                },
                success: function(user) {
                    if (user == "User not found. Please register") {
                        // alert("User not found. Please register");
                        let message = "User not found. Please register!";
                        alertModal(message); 
                    } else if (user == "Not authorized") {
                        // alert("Please try again with the correct details");
                        let message = "Please try again with the correct details!";
                        alertModal(message); 

                        // clearing inputs
                        $("#loginUsername").val("");
                        $("#loginPassword").val("");
                    } else {
                        // alert("Logged in");
                        let message = "Logged In!";
                        alertModal(message); 
                        $("#indexLoginModal").modal("hide");

                        // storing logged-in user's details
                        sessionStorage.setItem("userID", user["_id"]);
                        sessionStorage.setItem("username", user["username"]);
                        sessionStorage.setItem("userEmail", user["email"]);

                        // clearing inputs
                        $("#loginUsername").val("");
                        $("#loginPassword").val("");
                    } // end of inner if/else
                } // end of success
            }); // end of login user ajax
        } // end of outer if/else
    }); // end of login

    // Start of sign out
    $("#signOutBtn").click(function() {
        sessionStorage.clear();
        alert('You have logged out');
        window.location = "./index.html";
        // alert('You have logged out');
        let message = "You have logged out!";
        alertModal(message); 
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

        imagePreview();
        
        if(!userId) {
           let message = "Sign in to add product!";
            alertModal(message); 
        } else {
            if(isNaN(price) == true) {
                let message = "Price must be a number!";
                alertModal(message); 
            } else if (isNaN(price) == false) {
                if (productName == "" || description == "" || price == "" && (imgOneUrl == "" && imgTwoUrl == "" && imgThreeUrl == "")) {
                    let message = "Please login and enter all fields!";
                    alertModal(message); 
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
                            let message = "Product added!";
                            alertModal(message); 
        
                            $("#addProductName").val("");
                            $("#addProductDescription").val("");
                            $("#addProductPrice").val("");
                            $("#addProductImgOneUrl").val("");
                            $("#addProductImgTwoUrl").val("");
                            $("#addProductImgThreeUrl").val("");
                        },
                        error: function() {
                            let message = "Error: cannot call api";
                            alertModal(message); 
                        }
                    }); // end of ajax
                } // end of info fields if/else statement
            } // end of price is number if/else statement
        } // end of userId if/else statement
    }); // end of add product to DB

    // ----- home page start -----
    // reusable code for product cards (is called initially from the first successful ajax function)
    $('#landingProductsCards').empty() //empty the container

    // start of generate home card
    function generateHomeCard(productsFromMongo) {
        for(let i = 0; i < productsFromMongo.slice(0,8).length; i++) {
            $('#landingProductsCards').append(
                `
                    <div class="cards ${productsFromMongo[i].authorId}" id="${productsFromMongo[i]._id}">
                        <div class="cards__img">
                            <img src=${productsFromMongo[i].imgOneUrl} alt="Card image cap" class="cards-img">
                        </div>
                        <div class="cards__body">
                            <div class="cards__body-top">
                            <p class="cards__body-name">${productsFromMongo[i].productName}</p>
                            <p class="cards__body-price">$${productsFromMongo[i].price}</p>
                            </div>
                            <div class="cards__body-bottom" id="cardBottomBody">
                                <p class="cards__body-artist">Jane Doe</p>
                            </div>
                        </div>
                    </div>
                `
            ); // end of append
        } // end of for loop
    }; // start of generate home card


    // ----- home page end -----


    // ----- shop page start -----

    // hiding/showing relevent back btns depending on whoch page have been appended to core html
    $("#profileBackBtn").click(function() {
        let profileBackBtn = document.getElementById("profileBackBtn");
        profileBackBtn.classList.add("hide");
        
        let productBackBtn = document.getElementById("productBackBtn");
        productBackBtn.classList.remove("hide");

        document.getElementById("productSection").style.display = "none";
        document.getElementById("productDetails").style.display = "block";
    });

    // reusable code for product cards (is called initially from the first successful ajax function)
    function generateShopCard(productsFromMongo) {
        
        for(let i = 0; i < productsFromMongo.length; i++) {
            
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
                                <div class="cards__body-bottom" id="cardBottomBody">
                                    
                                </div>
                            </div>
                        </a>
                `
            );


            // when product card in shop is click, finds the relevant product details
            $(`.${productsFromMongo[i].authorId}`).click(function() {

                let productBackBtn = document.getElementById("productBackBtn");
                productBackBtn.classList.remove("hide");

                let thisUserId = this.classList[1];

                document.getElementById("productSection").style.display = "none";
                document.getElementById("productDetails").style.display = "block";

                $("#productBackBtn").click(function() {
                    
                    let productBackBtn = document.getElementById("productBackBtn");
                    productBackBtn.classList.add("hide");
                    document.getElementById("productSection").style.display = "block";
                    document.getElementById("productDetails").style.display = "none";
                });

                for(let i = 0; i < productsFromMongo.length; i++) {
                    if(productsFromMongo[i]._id === this.id) {
                        $("#productContainer").empty();

                        // calls the function that creates the product section of the product details page
                        generateProductSection(productsFromMongo, i);
                    } // end of if statement
                } // end of for loop

                // gets users from mongo to append store information to product details
                $.ajax({
                    url: `http://${url}/allUsersFromDB`,
                    type: "GET",
                    dataType: "json",
                    success: function(usersFromMongo) {
                        for(let i = 0; i < usersFromMongo.length; i++) {
                            if(thisUserId === usersFromMongo[i]._id) {
                                generateAuthorProductSection(usersFromMongo, i);
                            }
                        }
                    },
                    error: function() {
                        // alert("Unable to get users");
                        let message = "Unable to get users!";
                        alertModal(message); 
                    }
                }); // end of get users ajax
            }); // end of product detail appending
        } // end of for loop
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

        // view seller profile start
        $("#viewSellerProfile").click(function() {
            document.getElementById("productDetails").style.display = "none";
            document.getElementById("artistProfile").style.display = "block";
            const profileCurvedText = document.getElementById("artistProfileCurvedText");

            let profileBackBtn = document.getElementById("profileBackBtn");
            profileBackBtn.classList.remove("hide");
            
            let productBackBtn = document.getElementById("productBackBtn");
            productBackBtn.classList.add("hide");

            $("#cardBottomBody").empty();
            $("#artistProfileName").empty();
            $("#artistProfileDescription").empty();
            $("#artistProfileImgDiv").empty();
            $("#artistProfileInstaDiv").empty();
            $("#artistProfileFacebookDiv").empty();
            $("#artistProfileTwitterDiv").empty();

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
            } // end of if statement

            if(usersFromMongo[i].facebook !== "") {
                $("#artistProfileFacebookDiv").append(
                    `
                        <a class="fa-stack fa-2x" href=${usersFromMongo[i].facebook} target="_blank">
                            <i class="fa-solid fa-circle fa-stack-2x"></i>
                            <i class="fa-brands fa-facebook-f fa-stack-1x fa-inverse"></i>
                        </a>
                    `
                );
            } // end of if statement

            if(usersFromMongo[i].twitter !== "") {
                $("#artistProfileTwitterDiv").append(
                    `
                        <a class="fa-stack fa-2x" href=${usersFromMongo[i].twitter} target="_blank">
                            <i class="fa-solid fa-circle fa-stack-2x"></i>
                            <i class="fa-brands fa-twitter fa-stack-1x fa-inverse"></i>
                        </a>
                    `
                );
            } // end of if statement
        }); // end of view seller profile 
    } // end of generate product section

    function generateProductSection(productsFromMongo, i) {
        let productId = productsFromMongo[i]._id;
        viewComments(productId);
        
        
        $("#commentContainer").empty();
        $("#productImages").empty();
        $("#productInfo").empty();
        $("#artistProfileListings").empty();
        $("#commentBtnDiv").empty();

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

        $(".product-img-one").on("click", function(){
            $(".images-right").empty().append(
                `<img class="main-image" src=${productsFromMongo[i].imgOneUrl}>`
            )
        })

        $(".product-img-two").on("click", function(){
            $(".images-right").empty().append(
                `<img class="main-image" src=${productsFromMongo[i].imgTwoUrl}>`
            )
        })

        $(".product-img-three").on("click", function(){
            $(".images-right").empty().append(
                `<img class="main-image" src=${productsFromMongo[i].imgThreeUrl}>`
            )
        })


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

        // drop-downs
        $("#careDropDown").on("click", function(){
            $(".care-info").slideToggle(600);
            $(".care-down").toggle();
            $(".care-up").toggle();
        })

        $("#shippingDropDown").on("click", function(){
            $(".shipping-info").slideToggle(600);
            $(".shipping-down").toggle();
            $(".shipping-up").toggle();
        })

        $("#paymentDropDown").on("click", function(){
            $(".purchase-info").slideToggle(600);
            $(".purchase-down").toggle();
            $(".purchase-up").toggle();
        })


        $("#commentBtnDiv").append(
            `
                <button class="login-btn form-btn ${productsFromMongo[i]._id} ${productsFromMongo[i].authorId}" id="submitComment">Post Comment</button>
                <button class="cancel-button form-btn-alt">Cancel</button>
            `
        )

        $("#submitComment").click(function() {
            let thisProductId = this.classList[2];
            let authorId = this.classList[3];
            commentsFunction(thisProductId, authorId);
        });

        // THIS CODE ONLY ADDS SELECTED PRODUCT - needs fixing
        $("#artistProfileListings").append(
            `
                <div class="cards" style="width: 27rem;" data-value=${productsFromMongo[i]._id} id="productID">
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
    } // end of generate product section

    // ----- comments start -----
    $("#addCommentBtn").click(function() {
        userId = sessionStorage.getItem('userID');

        if (!userId) {
            alert("Please login to comment");
            let message = "Please log in to comment!";
            alertModal(message); 
        } else {
            $("#commentModal").modal("show");
        }
    }); // comments btn click end


    // when called this function posts comment to DB
    function commentsFunction(productId, authorId) {
        userId = sessionStorage.getItem('userID');
        let comment = document.querySelector("#commentField").value;
        let username = sessionStorage.getItem('username');
        let initial = username.charAt(0);
        let isArtist;

        if(authorId === sessionStorage.userID) {
            isArtist = true;
        } else {
            isArtist = false;
        }
        
        if (!userId) {
            // alert("Please login to comment");
            let message = "Please login to comment!";
            alertModal(message); 
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
                    let message = "Comment posted!!";
                    alertModal(message); 
                    document.querySelector("#commentField").value = "";
                    $("#commentModal").modal("hide");
                },
                error: function() {
                    let message = "Unable to post comment!";
                    alertModal(message); 
                }
            }); // end of ajax
        } // end of if/else statement
    } // end of post comments function

    // start of view comments function
    function viewComments(productId) {
        // view comments start
        $.ajax({
            url: `http://${url}/seeComments/${productId}`,
            type: "GET",
            success: function(commentsFromMongo) {
                $("#commentContainer").empty();
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
                let message = "Error: cannot retrieve comments";
                alertModal(message); 
            } // end of error
        }); // end of ajax
    } // end of view comments

    

    // ----- product page end -----


    // ----- profile page start -----

    function populateProfile(usersFromMongo) {
        if (sessionStorage.username !== "") {
            for(let i = 0; i < usersFromMongo.length; i++) {
                if(sessionStorage.userID === usersFromMongo[i]._id) {
                    const profileCurvedText = document.getElementById("profileCurvedText");

                    if (usersFromMongo[i].seller === true) {

                        $("#postListing").css("display", "block");
                        
                        profileCurvedText.innerHTML = "SELLER PROFILE."

                        $("#cardBottomBody").append(
                            `
                            <p class="card-artist" id="">${usersFromMongo[i].storeName}</p>
                            `
                        );

                        $("#profileName").append(
                            `
                                <h3 class="user-name">${usersFromMongo[i].storeName}</h3>
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
                                <h3 class="user-name">${usersFromMongo[i].username}</h3>
                            `
                        );
                    } // end of if/else statement

                    $("#profileDescription").append(
                        `<p class="user-about">${usersFromMongo[i].storeDescription}</p>`
                    );

                    $("#profileImgDiv").append(
                        `
                            <img class="user-img" src=${usersFromMongo[i].profilePicture} alt="store image">
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
    function populateProfileListings(productsFromMongo) {
        for(let i = 0; i < productsFromMongo.length; i++){
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
                            let message = "Product deleted!";
                            alertModal(message); 
                        },
                        error: function() {
                            let message = "Cannot Delete!";
                            alertModal(message); 
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
                            let message = "Error: Cannot update!";
                            alertModal(message); 
                        }
                    }); // end of ajax
                });
            }); // end of edit listing function
        } // end of for loop
        
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