const express = require("express");
const router = express.Router();
// const userModel = require("..models/userData.js");

//routes
router.get("/", (request, response) => {
  response.send("<h1>Hello from router users.js</h1>");
});

// used to make information available across the app
module.exports = router;
