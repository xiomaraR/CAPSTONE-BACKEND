const express = require("express");
const router = express.Router();
const User = require("../models/userData.js");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

//routes

//POST sign up user
let validations = [
  check("email")
    .isEmail()
    .withMessage("The email you have entered is not valid"),

  check("password")
    .isLength({ min: 5 })
    .withMessage("The password must have at least 5 characters"),
];

router.post("/signup", validations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = {};
    errors.array().forEach((error) => {
      err[error.param] = error.msg;
    });
    return res.status(422).json({ errors: err });
  }

  const password = req.body.password;
  const email = req.body.email;
  const username = req.body.username;

  try {
    let user = await User.findOne({ email, username });
    if (user) return res.status(400).send("User already registered.");

    user = new User({ email, password, username });
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();

    res.send(user);
    console.log("new user: ", user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

//POST sign in user
router.post("/login", async (req, res) => {
  console.log(req);
  const user = await User.findOne({ email: req.body.email }, "password");

  if (user) {
    console.log(user);
    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(req.body.password);

    console.log(user.password);
    console.log(req.body.password);
    if (validPassword) {
      res.status(200).json({ message: "Valid password" });
    } else {
      res.status(400).json({ error: "testing error" });
    }
  } else {
    res.status(401).json({ error: "User does not exist" });
  }
});

// GET ALL
router.get("/all", (request, response) => {
  User.find({}, "-password", (err, docs) => {
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
// router.get("/:userId", (request, response) => {
//   userModel.findOne(
//     {
//       _id: request.params.userId,
//     },
//     (err, post) => {
//       if (err) {
//         console.log("ERROR " + err);
//         response.status(500).json({ message: "Problems when reading user." });
//       } else {
//         console.log("User was successfully found.");
//         response.status(200).json(post);
//       }
//     }
//   );
// });

//UPDATE
router.put("/:userId", (request, response) => {
  const input = request.body;

  User.updateOne(
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
  User.deleteOne(
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
