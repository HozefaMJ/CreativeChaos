const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Importing Author Model
const Author = require("../../models/Authors");

// Importing Validators
const validateAuthorRegisterInput = require("../validation/registerAuthor");
const validateLoginInput = require("../validation/login");

// Config
const keys = require("../../config/keys");
const passport = require("passport");

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

// @route api/authors/login
// @desc login route for the authors
// @access Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // Checking if it's a registered user or not
  Author.findOne({ email: req.body.email }).then((author) => {
    // If Author is not found
    if (!author) {
      errors.email = "Author not found";
      return res.status(404).json(errors);
    }
    // Comparing the password
    bcrypt.compare(req.body.password, author.password).then((isMatch) => {
      if (isMatch) {
        // Author Matched

        // JWT payload
        const payload = {
          id: author.id,
          name: author.name,
        };
        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 * 24 },
          (err, token) => {
            res.json({
              success: true,
              email: author.email,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        errors.password = "Password is Incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route api/authors/current
// @desc Return current authors
// @access Private
router.get(
  "/current",
  passport.authenticate("author", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      date: req.user.date,
    });
  }
);

module.exports = router;
