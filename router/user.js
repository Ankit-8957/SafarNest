const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const UserController = require("../controllers/User.js");
const { renderFile } = require("ejs");

router.get("/signup", UserController.renderUser);
router.post("/signup", wrapAsync(UserController.signup));

//login page
router.get("/login",UserController.login);
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect: '/login' , failureFlash: true}),UserController.renderLogin);
//logout
router.get("/logout",UserController.logout);

module.exports = router;