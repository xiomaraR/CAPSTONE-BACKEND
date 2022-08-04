const express = require("express");
const router = express.Router();
const userModel = require("../models/userData.js");
// const userModel = require("..models/userData.js");

//routes
//POST
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

// LOGIN
router.post("/login", (request, response) => {
  const { username, password } = request.body;

  let existingUser;

  existingUser = userModel.findOne({ username: username }, (err, post) => {
    if (err) {
      console.log("ERROR " + err);
      response.status(500).json({ message: "Problems logging in." });
    } else {
      console.log("User was successfully found.");
      response.status(200).json({ message: "User successfully logged in." });
    }
  });
});

// GET ALL
router.get("/all", (request, response) => {
  userModel.find({}, "-password", (err, docs) => {
    if (err) {
      console.log("ERROR " + err);
      response
        .status(500)
        .json({ message: "Problems when reading the information." });
    } else {
      // if everything is working
      console.log("All the users were found.");
      response.status(200).json({ docs });
    }
  });
});

// GET ONE
router.get("/:userId", (request, response) => {
  userModel.findOne(
    {
      _id: request.params.userId,
    },
    (err, post) => {
      if (err) {
        console.log("ERROR " + err);
        response.status(500).json({ message: "Problems when reading user." });
      } else {
        console.log("User was successfully found.");
        response.status(200).json(post);
      }
    }
  );
});

//UPDATE
router.put("/:userId", (request, response) => {
  const input = request.body;

  userModel.updateOne(
    {
      _id: request.params.userId,
    },
    {
      username: input.username,
      password: input.password,
      // email: input.email,
      profile: input.profile,
    },
    (err, result) => {
      if (err) {
        console.log("ERROR " + err);
        response
          .status(500)
          .json({ message: "problems updating information." });
      } else {
        console.log("User successfully updated.");
        response.status(200).json({ message: "User successfully updated." });
      }
    }
  );
});

//DELETE
router.delete("/:userId", (request, response) => {
  userModel.deleteOne(
    {
      _id: request.params.userId,
    },
    (err) => {
      if (err) {
        console.log("ERROR " + err);
        response
          .status(500)
          .json({ message: "Problems finding user to delete." });
      } else {
        console.log("User successfully deleted from mongoDB.");
        response
          .status(200)
          .json({ message: "User successfully deleted from mongoDB." });
      }
    }
  );
});

// used to make information available across the app
module.exports = router;
