$(document).ready(function () {
    //connect once
    $.ajax({
        url: "https://pplcountai.herokuapp.com/connect",
        type: "POST",
        success: function (data) {
            console.log(data);
        },
    });
    $("button").click(function () {
        console.log($("#email:text").val())
        $.ajax({
            url: "https://pplcountai.herokuapp.com/create-business-account",
            type: "POST",
            data: JSON.stringify({
            email: $("#email:text").val(),
            pass: "blablabla",
            companyName: "amazoom:",
            address: "my house",
            postalCode: "qqqqq",
            maxNumberOfPeople: 30,
            description: "",
        }),
            contentType: "application/json; charset=utf-8",
            statusCode: {
                200: function (response) {
                    console.log(response);
                },
                401: function (response) {
                    console.log("uh oh!");
                },
            },
        });
    });
});