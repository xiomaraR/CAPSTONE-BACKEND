const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    zipcode: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    postedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

PostSchema.virtual("id", {
  id: this.id,
});

module.exports = mongoose.model("Post", PostSchema);
