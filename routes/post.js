// dependencies
const express = require("express");
const router = express.Router();
const User = require("../models/userData");
const Post = require("../models/postData");

//routes

//POST
router.post("/createpost", (request, response) => {
  // object request.body contains info that is sent from browser
  const input = request.body;

  const newPost = new Post({
    //js object that will be saved into mongoDB
    title: input.title,
    content: input.content,
    zipcode: input.zipcode,
  });

  newPost.save((err, doc) => {
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
        post: {
          title: newPost.title,
          content: newPost.content,
          zipcode: newPost.zipcode,
        },

        message: "The post was saved.",
        success: true,
      });
    }
  });
});

// Create post by user
router.get("/createpost/:userId", async (req, res) => {
  const post = await Post.create(req.body); // create new post
  const user = await User.findById(req.params.userId); // get existing user

  // associate post with user
  post.postedBy = user;
  post.save();

  // associate user with post
  user.posts.push(post);
  user.save();

  // send back post as response with author populated
  res.json(await post.populate("postedBy"));
});

// GET ALL
router.get("/all", (request, response) => {
  Post.find((err, docs) => {
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
router.get("/:postId", (request, response) => {
  Post.findOne(
    {
      _id: request.params.postId,
    },
    (err, post) => {
      if (err) {
        console.log("ERROR " + err);
        response.status(500).json({ message: "Problems reading post." });
      } else {
        console.log("Post was successfully found.");
        response.status(200).json(post);
      }
    }
  );
});

// Get a user's posts
router.get("/myPosts", (request, response) => {
  postModel
    .find(
      {
        postedBy: request.user._id,
      },
      (err, post) => {
        if (err) {
          console.log("ERROR " + err);
          response.status(500).json({ message: "Problems reading posts." });
        } else {
          console.log("Posts were successfully found.");
          response.status(200).json(post);
        }
      }
    )
    .populate("postedBy");
});

//UPDATE
router.put("/:postId", (request, response) => {
  const input = request.body;

  postModel.updateOne(
    {
      _id: request.params.postId,
    },
    { author: input.author, title: input.title, content: input.content },
    (err, result) => {
      if (err) {
        console.log("ERROR " + err);
        response
          .status(500)
          .json({ message: "problems updating information." });
      } else {
        console.log("Post successfully updated.");
        response.status(200).json({ message: "Post successfully updated." });
      }
    }
  );
});

//DELETE
router.delete("/:postId", (request, response) => {
  postModel.deleteOne(
    {
      _id: request.params.postId,
    },
    (err) => {
      if (err) {
        console.log("ERROR " + err);
        response
          .status(500)
          .json({ message: "Problems finding post to delete." });
      } else {
        console.log("Post successfully deleted from mongoDB.");
        response
          .status(200)
          .json({ message: "Post successfully deleted from mongoDB." });
      }
    }
  );
});

// used to export/make information avail across the app
module.exports = router;
