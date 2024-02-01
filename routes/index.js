var express = require("express");
var router = express.Router();
let userModel = require("./users");
let postModel = require("./post");
let passport = require("passport");
let upload = require("./multer");
let localStr = require("passport-local");
passport.use(new localStr(userModel.authenticate()));

router.get("/", function (req, res) {
  console.log("server is running on http://localhost:3000");
  res.render("login", { error: req.flash("error") });
});

router.get("/registerpage", function (req, res) {
  res.render("register");
});

router.post("/register", function (req, res) {
  let userData = new userModel({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
  });

  userModel
    .register(userData, req.body.password)
    .then(function (registeredUser) {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/profile");
      });
    })
    .catch(function (err) {
      console.error(err);
      // Handle registration error, such as displaying a message to the user.
      res.redirect("/register"); // Redirect to the registration page or handle as appropriate.
    });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
    failureFlash: true,
  }),
  function (req, res) {}
);

router.get("/profile", isAllowed, async (req, res) => {
  let user = await userModel.findOne({
    username: req.session.passport.user,
  });
  let posts = await user.populate("posts");
  //let user = req.user;
  res.render("profile", { user , posts});
});

router.post("/upload", isAllowed, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(404).send("no file uploaded.");
  }
  // res.send("file uploaded successfuly .")
  let user = await userModel.findOne({ username: req.session.passport.user });
  let newPost = await postModel.create({
    posttext: req.body.posttext,
    posturl: req.file.filename,
    user: user._id,
  });
  user.posts.push(newPost._id);
  await user.save();
  res.redirect("/profile");
});

router.get("/feed", isAllowed, async(req, res) => {
  let user = await userModel.findOne({username:req.session.passport.user});
  res.render("feed",{user: user});
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isAllowed(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
module.exports = router;

// multer desc.
// npm i multer uuid
