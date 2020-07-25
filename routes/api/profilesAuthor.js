const express = require("express");
const router = express.Router();

// @route api/profiles/test
// @desc Testing route for the profiles
// @access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Testing Profiles Routes for authors" });
});

module.exports = router;
