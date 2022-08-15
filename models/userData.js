const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const validate = require("mongoose-validator");
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;
const validator = require("email-validator");

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
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
      unique: true,
      index: true,
    },
    posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],

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

// function to verify email and password

// UserSchema.statics.findByCredentials = async (email, password, req) => {
//   const user = await User.findOne({ email: email });

//   if (!email) {
//     throw new Error("incorrect email or password");
//   }

//   const isValid = await bcrypt.compare(req.body.password, user.password);

//   if (!isValid) {
//     throw new Error("incorrect email or password");
//   }

//   return user;
// };

const User = mongoose.model("User", UserSchema);
module.exports = User;
