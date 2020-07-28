const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewsPostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "authors",
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

module.exports = PostsNews = mongoose.model("postNews", NewsPostSchema);
