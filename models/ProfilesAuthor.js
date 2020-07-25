const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorProfileSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "authors",
  },
  nickname: {
    type: String,
    required: true,
    max: 20,
  },
  profilepicture: {
    type: String,
  },
  status: {
    type: String,
    max: 20,
  },
  bio: {
    type: String,
    max: 100,
  },
  location: {
    type: String,
    max: 40,
  },
  website: {
    type: String,
  },
  isAuthor: {
    type: String,
    default: true,
  },
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
    facebook: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = AuthorProfile = mongoose.model(
  "authorProfile",
  authorProfileSchema
);
