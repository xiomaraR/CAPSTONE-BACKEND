// dependencies
const express = require("express");
const app = express();
const path = require("path"); //included w/ nodejs
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const createError = require('http-errors');


// connection to mongodb
mongoose.connect(
  "mongodb+srv://FluffyFriends:4z6NIVZAQeLoUBrw" +
    "@petscluster.uivel.mongodb.net/petsDatabase" +
    "?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// method used to let us know if there was an error connecting
mongoose.connection.on("error", (err) => {
  console.log("ERROR: " + err);
});

// If connection is working
mongoose.connection.once("open", () => {
  console.log("The connection to MongoDB is working");
});

// takes input that comes from browser and formats as json object
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// static web server to test web server
app.use(express.static(path.join(__dirname, "public")));

//REST API (register routers with files that contains code that is run when path is used)
app.use("/api/users", require("./routes/user.js"));
app.use("/api/posts", require("./routes/post.js"));

//get is http method to establish communication
//between server and the browser
// parameters inside get are addresses, slash represents homepage
// request and response are the callback functions
// app.get("/", (request, response) => {
// sending a response to the browser
//   response.send("<h1>Hello from web server!!!</h1>");
// }); once you have html page in public folder for static web server you don't need above code as server handler

// setting up the port
app.listen(5000, () => {
  // if everything is working this will display in console
  console.log("Listening at localhost:5000");
});

// to start server: npx nodemon --ext html,js,json
// also npx nodemon ./server.js
// npx nodemon --watch ./  <used to start server once mongoose connection is set>
