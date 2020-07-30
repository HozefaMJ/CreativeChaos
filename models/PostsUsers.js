const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserPostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
  },
  titleText: {
    type: String,
    required: true,
  },
  postImage: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      author: {
        type: Schema.Types.ObjectId,
        ref: "authors",
      },
    },
  ],
  comments: [
    {
      author: {
        type: Schema.Types.ObjectId,
        ref: "authors",
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      profilepicture: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = PostsUsers = mongoose.model("postUsers", UserPostSchema);
