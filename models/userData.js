const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  // uniqueValidator = require("mongoose-unique-validator"),
  bcrypt = require("bcryptjs"),
  SALT_WORK_FACTOR = 10;

const Email = new Schema({
  address: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    // match: [/\S+@\S+\.\S+/, "is invalid"],
    index: true,
  },
  // Change the default to true if you don't need to validate a new user's email address
  // validated: { type: Boolean, default: true },
});

const Point = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const UserSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true,
    },
    //Our password is hashed with bcrypt
    password: { type: String, required: true },
    email: { type: Email, required: false },
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
        location: {
          type: Point,
          required: false,
        },
      },
    },
    active: { type: Boolean, default: true },
    // posts: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Post",
    //   required: true,
    // },
  },
  {
    timestamps: true,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual("id", {
  id: this.id,
});

// adds pre-save validation for unique fields within a Mongoose schema
// UserSchema.plugin(uniqueValidator, { message: "is already taken." });

// pre("save") function to hash the user password
// UserSchema.pre("save", (next) => {
// only hash the password if it has been modified (or is new)
//   if (!this.isModified("password")) {
//     return next();
//   }
//   this.password = bcrypt.hashSync(this.password, 10);
//   next();
// });

// function to verify password
UserSchema.methods.comparePassword = function (plaintext, callback) {
  return callback(null, bcrypt.compareSync(plaintext, this.password));
};

module.exports = mongoose.model("User", UserSchema);
