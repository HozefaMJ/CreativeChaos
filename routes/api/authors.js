const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// Importing Author Model
const Author = require("../../models/Authors");

// Importing Validators
const validateAuthorRegisterInput = require("../validation/registerAuthor");
const keys = require("../../config/keys");

// @route api/authors/test
// @desc Testing route for the authors
// @access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Testing Authors Routes" });
});

// @route api/authors/register
// @desc registration route for the authors
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateAuthorRegisterInput(req.body);
  if (!isValid || req.body.key !== keys.authorKey) {
    // Checking the input data is valid or not also
    //Checking if the key is valid or not
    errors.key = "Invalid Key";
    return res.status(404).json(errors);
  }

  // Checking if the user exists not
  Author.findOne({ email: req.body.email }).then((user) => {
    // If Author Found
    if (user) {
      errors.email = "Author already exists";
      return res.status(404).json(errors);
    } else {
      // If author is not found then register the author
      const newAuthor = new Author({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAuthor.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          newAuthor.password = hash;

          newAuthor
            .save()
            .then((author) => res.json(author))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
