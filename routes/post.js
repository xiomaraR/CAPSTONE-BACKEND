const express = require("express");
const router = express.Router();
const postModel = require("../models/postData.js");

//routes
// router.get("/:userId/:postId", () => {});
router.get("/", (request, response) => {
  response.send("<h1>Hello from router posts.js</h1>");
});

router.post("/", (request, response) => {
  const input = request.body; //saving info coming from browser

  const newDocument = new postModel({
    //js object that will be saved into mongoDB
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

// used to make information avail across the app
module.exports = router;
