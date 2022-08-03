const express = require("express");
const router = express.Router();
const userModel = require("../models/userData.js");
// const userModel = require("..models/userData.js");

//routes
router.post("/signup", (request, response) => {
  const input = request.body;

  const newDocument = new userModel({
    //js object that will be saved into mongoDB
    username: input.username,
    password: input.password,
    // email: input.email,
    profile: input.profile,
    // author: request.user._id,
  });

  newDocument.save((err, doc) => {
    // if an error occurs while saving info this if block will run
    if (err) {
      console.log("ERROR: " + err);
      response.status(500).json({
        message: "Problems registering User.",
        success: false,
      });
    } else {
      //everything is working
      console.log("User successfully registered. ");
      response.status(200).json({
        message: "The user was registered.",
        success: true,
      });
    }
  });
});

// used to make information available across the app
module.exports = router;
