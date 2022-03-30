console.log("linked");

$(document).ready(function() {
    console.log("document ready");

    let url;

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

    $("#signUpBtn").click(function() {
        event.preventDefault();

        let username = $("#signUpUsername").val();
        let email = $("#signUpEmail").val();
        let password = $("#signUpPassword").val();
        let seller = document.querySelector('input[name="signUpSeller"]:checked').value;
        let storeName = $("#signUpStoreName").val();
        let storeDescription = $("#signUpStoreDescription").val();

        console.log(username, email, password, seller, storeName, storeDescription);

        if (username == "" || email == "" || password == "") {
            alert("Please enter all fields");
        } else if (seller == "yes" && username == "" || email == "" || password == "" || storeName == "" || storeDescription == "") {
            alert("Please enter all fields, including store fields");
        } else {
            console.log("Form complete");
        }

    });

}); // end of document.ready