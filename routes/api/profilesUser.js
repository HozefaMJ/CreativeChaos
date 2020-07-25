const express = require("express");
const passport = require("passport");
const ProfilesUser = require("../../models/ProfilesUser");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Importing Validators
const validateProfileInput = require("../validation/profile");
const { type } = require("os");
const { profile } = require("console");
const Users = require("../../models/Users");

// Set Storage
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("myImage");

// Check file type
function checkFileType(file, cb) {
  // Allowed Extensions
  const filetypes = /jpeg|jpg|png/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Image Only!");
  }
}

// @route /api/profile/User/test
// @desc Testing route for the profiles
// @access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Testing Profiles Routes for users" });
});

// @route /api/profile/User/
// @desc get current user's profile
// @access Private
router.get(
  "/",
  passport.authenticate("user", { session: false }),
  (req, res) => {
    let errors = {};
    // Search profile in profile model
    ProfilesUser.findOne({ user: req.user.id })
      .populate("user", ["name"])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "Profile not created yet";
          return res.status(404).json(errors);
        }
        res.json(profile);
      });
  }
);

// @route /api/profile/User/
// @desc post current user's profile
// @access Private
// @dataInput {NickName, Photo, Status, Bio, Website, Location, {Social Media}}
router.post(
  "/",
  upload,
  passport.authenticate("user", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
    } else {
      const profileFields = {};
      profileFields.user = req.user.id;
      if (req.body.nickname) profileFields.nickname = req.body.nickname;
      if (req.file.path) profileFields.profilepicture = req.file.path;
      if (req.body.status) profileFields.status = req.body.status;
      if (req.body.bio) profileFields.bio = req.body.bio;
      if (req.body.website) profileFields.website = req.body.website;
      if (req.body.location) profileFields.location = req.body.location;

      profileFields.social = {};
      if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
      if (req.body.instagram)
        profileFields.social.instagram = req.body.instagram;
      if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
      if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
      if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

      ProfilesUser.findOne({ user: req.user.id }).then((profile) => {
        if (profile) {
          // Update
          ProfilesUser.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          ).then((profile) => res.json(profile));
        } else {
          // Create
          new ProfilesUser(profileFields)
            .save()
            .then((profile) => res.json(profile));
        }
      });
    }
  }
);

// @route GET api/profile/all
// @desc Get all Profiles
// @access Public
router.get("/all", (req, res) => {
  let errors = {};

  ProfilesUser.find()
    .populate("user", ["name", "email"])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = "No profile found";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch((err) =>
      res.status(404).json({ noProfile: "There are no profiles" })
    );
});

// @route GET api/profile/name/:name
// @desc Get all Profiles by name
// @access Public
router.get("/name/:name", (req, res) => {
  const errors = {};

  ProfilesUser.findOne({ name: req.params.name })
    .populate("user", ["name", "email"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "No profile found";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => res.status(404).json(err));
});

// @route GET api/profile/user/:user_id
// @desc Get all Profiles by user_id
// @access Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};

  ProfilesUser.findOne({ user: req.params.user_id })
    .populate("user", ["name", "email"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "No profile found";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => res.status(404).json(err));
});

// @route Delete api/profile/
// @desc Deleting the current user and profile
// @access Private
router.delete(
  "/",
  passport.authenticate("user", { session: false }),
  (req, res) => {
    ProfilesUser.findOneAndRemove({ user: req.user.id }).then(() => {
      Users.findOneAndRemove({ _id: req.user.id }).then(() => {
        res.json({ success: true });
      });
    });
  }
);

module.exports = router;
