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

server.listen(server.get("port"));
