const express = require("express");
const authRouter = express.Router();
const User = require("./../models/User.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const parser = require("./../config/cloudinary");
const { isLoggedIn } = require("./../utils/auth-middleware");

// Your routes
authRouter.get("/signup", (req, res, next) => {
  res.render("Signup");
});

authRouter.post("/signup", parser.single("profilepic"), (req, res, next) => {
  const { email, password } = req.body;
  let imageUrl;
  if (req.file) {
    imageUrl = req.file.secure_url;
  }

  // Here we usually have our authentication/signup logic...
  // ...checking email/password, hashing password, etc.

  // 2 - Check if `email` and `password` are empty and display error message
  if (email === "" || password === "") {
    const props = { errorMessage: "Enter email and password" };

    res.render("Signup", props);
    return;
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        const props = { errorMessage: "The email is already taken" };
        res.render("Signup", props);
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = { email, password: hashedPassword, image: imageUrl };

      const pr = User.create(newUser);
      return pr;
    })
    .then((createdUser) => {
      createdUser.password = "***";
      req.session.currentUser = createdUser;

      res.redirect("/profile");
    })
    .catch((err) => console.log(err));
});

authRouter.get("/login", (req, res, next) => {
  res.render("Login");
});

authRouter.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    const props = { errorMessage: "Indicate email and password" };

    res.render("Login", props);
    return;
  }

  User.findOne({ email }).then((user) => {
    if (!user) {
      // If the user by the given `username` was not found, send error message
      const props = { errorMessage: "The username doesn't exist" };

      res.render("Login", props);
      return;
    }

    const passwordCorrect = bcrypt.compareSync(password, user.password);

    if (passwordCorrect) {
      // Create the session - which also triggers the creation of the cookie
      req.session.currentUser = user;

      res.redirect("/");
    } else {
      res.render("Login", { errorMessage: "Incorrect password" });
    }
  });
});

authRouter.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      res.render("Error");
    } else {
      res.redirect("/auth/login");
    }
  });
});

module.exports = authRouter;
