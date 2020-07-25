const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
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

module.exports = UserProfile = mongoose.model("userProfile", userProfileSchema);
