// dependencies
const express = require("express");
const router = express.Router();
const postModel = require("../models/postData.js");

//routes

//POST
router.post("/", (request, response) => {
  // object request.body contains info that is sent from browser
  const input = request.body;

  const newDocument = new postModel({
    //js object that will be saved into mongoDB
    author: input.author,
    title: input.title,
    content: input.content,
    // author: request.user._id,
  });

  newDocument.save((err, doc) => {
    // if an error occurs while saving info this if block will run
    if (err) {
      console.log("ERROR: " + err);
      response.status(500).json({
        message: "Problems submitting post.",
        success: false,
      });
    } else {
      //everything is working
      console.log("Post successfully submitted. ");
      response.status(200).json({
        message: "The post was saved.",
        success: true,
      });
    }
  });
});

// GET ALL
router.post("/all", (request, response) => {
  postModel.find((err, docs) => {
    if (err) {
      console.log("ERROR " + err);
      response
        .status(500)
        .json({ message: "Problems when reading the information." });
    } else {
      // if everything is working
      console.log("All the posts were found.");
      response.status(200).json({ docs });
    }
  });
});

// GET ONE
// router.get("/:userId/:postId", () => {});

// used to export/make information avail across the app
module.exports = router;
