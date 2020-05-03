const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const backend = require("./backend");

server.use(bodyParser.json());

//setting the port.
server.set("port", process.env.PORT || 3000);

server.use(express.static(__dirname));

server.post("/connect", function (request, response) {
    backend
        .connect()
        .then(() => {
            response.status(200).send("Connection successful!");
        })
        .catch((err) => {
            response.status(401).send("Connection failed!");
        });
});

server.post("/list", function (request, response) {
    backend
        .companyList(request.body.query)
        .then((result) => {
            response.status(200).json(result);
        })
        .catch((err) => {
            response.status(401).send("List failed!");
        });
});

server.post("/create-business-account", function (request, response) {
    backend
        .createBusinessAccount(
            request.body.email,
            request.body.pass,
            request.body.companyName,
            request.body.address,
            request.body.postalCode,
            request.body.maxNumberOfPeople,
            request.body.description
        )
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((err) => {
            response.status(401).send("Account failed to be created!");
        });
});

server.post("/delete-business-account", function (request, response) {
    backend
        .deleteBusinessAccount(request.body.email, request.body.pass)
        .then((obj) => {
            response.status(200).json(obj);
        })
        .catch((err) => {
            response.status(401).send("Account failed to be deleted!");
        });
});

server.post("/update-number-of-people", function (request, response) {
    backend
        .updateNumberOfPeople(
            request.body.email,
            request.body.pass,
            request.body.numberOfPeople
        )
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((err) => {
            response.status(401).send("Failed to update number of people!");
        });
});

server.post("/increment-number-of-people", function (request, response) {
    backend
        .incrementNumberOfPeople(request.body.email, request.body.pass)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((err) => {
            response.status(401).send("Failed to increase number of people!");
        });
});

server.post("/decrement-number-of-people", function (request, response) {
    backend
        .decrementNumberOfPeople(request.body.email, request.body.pass)
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((err) => {
            response.status(401).send("Failed to decrease number of people!");
        });
});

server.post("/update-description", function (request, response) {
    backend
        .updateDescription(
            request.body.email,
            request.body.pass,
            request.body.description
        )
        .then((res) => {
            response.status(200).json(res);
        })
        .catch((err) => {
            response.status(401).send("Failed to update description!");
        });
});

server.listen(server.get("port"));
