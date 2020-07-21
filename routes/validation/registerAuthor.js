const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAuthorRegisterInput(data) {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  data.key = !isEmpty(data.key) ? data.key : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Please enter your name";
  }

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name should atleast 2 characters";
  }

  if (Validator.isEmpty(data.email)) {
    data.email = "Please enter Email";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Please enter a valid email";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Please enter password";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password should be atleast 6 digits";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Please enter confirm password";
  }

  if (!Validator.equals(data.password2, data.password)) {
    errors.password2 = "Confirm password doesn't match";
  }

  if (Validator.isEmpty(data.key)) {
    errors.key = "Please enter the key";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors),
  };
};
