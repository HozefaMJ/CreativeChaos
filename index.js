const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
// Routes
const users = require("./routes/api/users");
const authors = require("./routes/api/authors");
const posts = require("./routes/api/posts");
const profileUser = require("./routes/api/profilesUser");
const profileAuthor = require("./routes/api/profilesAuthor");

const app = express();

// Body-Parser Middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

// Passport Middlware
app.use(passport.initialize());

// Passport Config File
require("./config/passportUser")(passport);

// MongoDB Config
const db = require("./config/keys").mongoURI;
// Connecting MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// First Route
app.get("/", (req, res) => {
  res.json({ msg: "Hello Creative people" });
});

app.use("/api/users", users);
app.use("/api/authors", authors);
app.use("/api/posts", posts);
app.use("/api/profile/User", profileUser);
app.use("/api/profile/Author", profileAuthor);

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Creating Chaos on port ${port}`));
