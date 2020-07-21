const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const keys = require("../../config/keys");
// Importing Validators
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Importing MongoDB Models
const User = require("../../models/Users");

// @route api/users/test
// @desc Testing route for the users
// @access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Testing Users Routes" });
});

// @route api/users/register
// @desc route for registering the new users
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = "Email Already Exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          newUser.password = hash;

          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });

  //res.json(req.body);
});

// @route api/users/login
// @desc route for login in the users
// @access Public
router.post("/login", (req, res) => {
  // Validating the user input
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  // User data
  const email = req.body.email;
  const password = req.body.password;

  // Checking is the user exists or not
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    // Comparing the password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched

        // JWT payload
        const payload = {
          id: user.id,
          name: user.name,
        };

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 * 24 },
          (err, token) => {
            res.json({
              success: true,
              email: email,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        errors.password = "Password is incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route api/users/current
// @desc return current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      data: req.user.date,
    });
  }
);

module.exports = router;
