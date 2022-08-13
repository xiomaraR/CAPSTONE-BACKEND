const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  uniqueValidator = require("mongoose-unique-validator"),
  bcrypt = require("bcrypt"),
  SALT_WORK_FACTOR = 10;

const Email = new Schema({
  address: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
    unique: true,
    index: true,
    validate: {
      validator: () => Promise.resolve(false),
      message: "Email validation failed",
    },
  },
});

// setting up single points on a map
const Point = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
  },
  coordinates: {
    type: [Number],
    index: "2dsphere",
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
    email: { type: Email },
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
        },
      },
    },
    active: { type: Boolean, default: true },
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
UserSchema.plugin(uniqueValidator, { message: "is already taken." });

// pre("save") function to hash the user password

UserSchema.pre("save", function (next) {
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }

          user.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});

// function to verify password
UserSchema.methods.comparePassword = function (plaintext, callback) {
  return callback(null, bcrypt.compareSync(plaintext, this.password));
};

module.exports = mongoose.model("User", UserSchema);
