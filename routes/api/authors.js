const express = require("express");
const router = express.Router();

// @route api/authors/test
// @desc Testing route for the authors
// @access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Testing Authors Routes" });
});

module.exports = router;
