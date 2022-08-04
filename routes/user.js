const express = require("express");
const router = express.Router();
const userModel = require("../models/userData.js");
const HttpError = require("http-error");





//route to sign up a user
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







// Route to login a user
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  let existingUser;

  try {
    existingUser = await userModel.findOne({ username: username })
  } catch (err) {
  //   const error = new HttpError(
  //     'Logging in failed, please try again later.',
  //     500
  //   );
  //   return next(error);
  // }
console.log('error')
  }
  if (!existingUser || existingUser.password !== password) {
    // const error = new HttpError(
      console.log(
      'Invalid credentials, could not log you in.',
      401
    );
    // return next(error);
  }
  res.json({message: 'Logged in!'});
});





// Route to get all the users
router.get("/all", async (req, res, next) => {
  let users;
  // try {
    users = await userModel.find({}, '-password');
  // } catch (err) {
  //   const error = new HttpError(
  //     'Fetching users failed, please try again later.',
  //     500
  //   );
  //   return next(error);
  // }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
});






// Route to get one user by their username
router.get("/:username", async (req, res, next) => {
  const username = req.params.username; 

  let user;
  try {
    user = await userModel.findOne({username:username});
  } catch (err) {
    // const error = new HttpError(
    //   'Something went wrong, could not find a place.',
    //   500
    // );
    // return next(error);
    console.log("error")
  }

  if (!user) {
    // const error = new HttpError(
    //   'Could not find a place for the provided id.',
    //   404
    // );
    // return next(error);
    console.log("error")
  }

  res.json({ user: user.toObject({ getters: true }) }); // => { place } => { place: place }
})







// Route to delete a user
router.delete("/:userName", async (req, res, next) => {
  const userName = req.params.userName; 

  let user;
  try {
    user= await userModel.findOne({userName:userName});
  } catch (err) {
    // const error = new HttpError(
    //   'Something went wrong, could not find a place.',
    //   500
    // );
    // return next(error);
    console.log("error")
  }

  if (!user) {
    // const error = new HttpError(
    //   'Could not find a place for the provided id.',
    //   404
    // );
    // return next(error);
    console.log("error")
  }

  try {
    await user.remove();
  } catch (err) {
    // const error = new HttpError(
    //   'Something went wrong, could not delete place.',
    //   500
    // );
    // return next(error);
    console.log("error")
  }

  res.status(200).json({ message: 'Deleted user.' });
})

// used to make information available across the app
module.exports = router;
