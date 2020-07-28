const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";
  data.titleText = !isEmpty(data.titleText) ? data.titleText : "";
  //data.postImage = !isEmpty(data.postImage) ? data.postImage : "";

  if (!Validator.isLength(data.text, { min: 100, max: 3000 })) {
    errors.text = "Post must be between 100 and 3000 characters";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }

  if (!Validator.isLength(data.titleText, { min: 5, max: 40 })) {
    errors.titleText = "Title Text must be between 100 and 3000 characters";
  }

  if (Validator.isEmpty(data.titleText)) {
    errors.titleText = "Title Text field is required";
  }

  /*
  if (Validator.isEmpty(data.postImage)) {
    errors.postImage = "Post image is required";
  }
  */

  return {
    errors: errors,
    isValid: isEmpty(errors),
  };
};
