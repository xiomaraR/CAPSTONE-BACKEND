// dependencies
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// adding cors to app
app.use(cors());

// connection to mongodb
require("dotenv").config();

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
app.use("/users", require("./routes/user.js"));
app.use("/posts", require("./routes/post.js"));

app.get("*", (request, response) => {
  response.send("<h1>ERROR 404: Page Not Found</h1>");
});

// setting up the port
app.listen(5000, () => {
  // if everything is working this will display in console
  console.log("Listening at localhost:5000");
});

// to start server: npx nodemon --ext html,js,json
// also npx nodemon ./server.js
// npx nodemon --watch ./  <used to start server once mongoose connection is set>
