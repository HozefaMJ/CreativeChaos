const express = require("express");
const router = express.Router();
const multer = require("multer");
const passport = require("passport");
const path = require("path");

// Importing Models
const Authors = require("../../models/Authors");
const Users = require("../../models/Users");
const ProfilesAuthor = require("../../models/ProfilesAuthor");
const PostsUsers = require("../../models/PostsUsers");

// Importing Validators
const validatePostInput = require("../validation/post");
const validateCommentInput = require("../validation/comment");

// Set Storage
const storage = multer.diskStorage({
  destination: "./public/uploads/Posts/Users/",
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
  limits: { fileSize: 1024 * 1024 * 35 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("myPost");

// Check File Type
function checkFileType(file, cb) {
  // Allowed Extensions
  const filetypes = /jpeg|jpg|png/;
  // Check Extensions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check MimeType
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Image Only!");
  }
}

// @route api/Posts/test
// @desc Testing route for the Posts
// @access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Testing Users Posts Routes" });
});

// @route api/Posts/
// @desc Get posts
// @access Public
router.get("/", (req, res) => {
  PostsUsers.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ nopostfound: "No Posts Found" }));
});

// @route api/Posts/
// @desc Create news posts
// @access Private
router.post(
  "/",
  upload,
  passport.authenticate("user", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    // Creating new Post
    const newPost = new PostsUsers({
      name: req.user.name,
      titleText: req.body.titleText,
      postImage: req.file.path,
      text: req.body.text,
      user: req.user.id,
    });

    newPost
      .save()
      .then((post) => res.json(post))
      .catch((err) => res.json(err));
  }
);

// @route GET api/posts/:id
// @desc Get posts by id
// @access Public
router.get("/:id", (req, res) => {
  PostsUsers.findById(req.params.id)
    .then((post) => res.json(post))
    .catch((err) =>
      res.status(404).json({ nopostfound: "No Post with that ID" })
    );
});

// @route Delete api/posts/:id
// @desc Delete Posts
// @access Private
router.delete(
  "/:id",
  passport.authenticate("user", { session: false }),
  (req, res) => {
    // Alternative code block available below
    PostsUsers.findById(req.params.id).then((post) => {
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({
          notAuthorized: "You are not authorized to delete this post",
        });
      }
      post
        .remove()
        .then(() => res.json({ success: true }))
        .catch((err) =>
          res.status(404).json({ postNotFound: "No Post Found With That ID" })
        );
    });
  }
);

// @route POST api/posts/like/:id
// @desc Liked Posts
// @access Private passport.authenticate("user", { session: false }),
router.post(
  "/like/:id",
  passport.authenticate(["author", "user"], { session: false }),
  (req, res) => {
    PostsUsers.findById(req.params.id)
      .then((post) => {
        if (
          post.likes.filter((like) => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyLiked: "You have already liked this post" });
        }
        // Add user to liked array
        post.likes.unshift({ user: req.user.id });

        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postNotFound: "No post found" }));
  }
);

// @route POST api/posts/unlike/:id
// @desc UNLiked Posts
// @access Private
router.post(
  "/unlike/:id",
  passport.authenticate(["user", "author"], { session: false }),
  (req, res) => {
    PostsUsers.findById(req.params.id)
      .then((post) => {
        if (
          post.likes.filter((like) => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res
            .status(400)
            .json({ notLiked: "You have not liked the post yet" });
        }
        // Get the removed Index
        const removeIndex = post.likes
          .map((item) => item.user.toString())
          .indexOf(req.user.id);

        // Splice out of the array
        post.likes.splice(removeIndex, 1);

        // Save
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postNotFound: "Post Not Found" }));
  }
);

// @route POST api/posts/comment/:id
// @desc add comment Posts
// @access Private
router.post(
  "/comment/:id",
  passport.authenticate(["author", "user"], { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const commentFields = {};
    if (req.user.id) commentFields.user = req.user.id;
    if (req.user.name) commentFields.name = req.user.name;
    if (req.body.text) commentFields.text = req.body.text;

    PostsUsers.findById(req.params.id)
      .then((post) => {
        const newComment = {
          user: commentFields.user,
          name: commentFields.name,
          text: commentFields.text,
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // Save
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route DELETE api/posts/comment/:id/:comment_id
// @desc Remove comment from post
// @access Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate(["author", "user"], { session: false }),
  (req, res) => {
    PostsUsers.findById(req.params.id)
      .then((post) => {
        // Check to see if the comment exists
        if (
          post.comments.filter(
            (comment) => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentDoesntExist: "Comment Doenst Exists" });
        }
        // Get remove index
        const removeIndex = post.comments
          .map((item) => item._id.toString())
          .indexOf(req.params.comment_id);

        // To remove it we have to splice it out of the array
        post.comments.splice(removeIndex, 1);

        // Save
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;

/*

ProfilesAuthor.findOne({ user: req.user.id }).then((profile) => {
      PostsNews.findById(req.params.id).then((post) => {
        // Check for post owner
        if (post.author.toString() !== req.user.id) {
          return res.status(401).json({
            notAuthorized: "You are not authorized to delete this post",
          });
        }
        post.remove().then(() => res.json({ success: true }));
      });
    });

*/
