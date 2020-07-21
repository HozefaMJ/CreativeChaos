const express = require("express");
const router = express.Router();

// @route api/Posts/test
// @desc Testing route for the Posts
// @access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Testing Posts Routes" });
});

module.exports = router;
