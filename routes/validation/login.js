const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Please enter a valid email";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Please enter password";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors),
  };
};
