//server.js
const express = require("express");
const server = express();

//setting the port.
server.set("port", process.env.PORT || 3000);

// //Adding routes
// server.get("/", (request, response) => {
//     response.sendFile(__dirname + "/index.html");
// });

// server.get("/about-us", (request, response) => {
//     response.sendFile(__dirname + "/about-us.html");
// });

server.use(express.static(__dirname));

// server.get("/users", (request, response) => {
//     response.json(users);
// });

//Binding to localhost://3000
server.listen(server.get("port"));
