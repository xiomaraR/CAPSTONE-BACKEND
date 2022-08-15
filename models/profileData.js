const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String,
    },
  },
});

const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;
