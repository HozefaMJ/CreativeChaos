/*
This validation file can be used for both Author and User Routes
*/

const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.nickname = !isEmpty(data.nickname) ? data.nickname : "";

  if (Validator.isEmpty(data.nickname)) {
    errors.nickname = "Please enter Nickname";
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Please enter a Valid Website URL";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "Please enter a valid url for youtube";
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = "Please enter a valid url for instagram";
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "Please enter a valid url for twitter";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "Please enter a valid url for linkedin";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "Please enter a valid url for facebook";
    }
  }

  return {
    errors: errors,
    isValid: isEmpty(errors),
  };
};
