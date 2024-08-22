const express = require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controlers/user.js");

router.get("/signup",userController.renderSign);

router.post("/signUp", wrapAsync (userController.signUp));

router.get("/login",userController.renderLogin );


router.post("/login", saveRedirectUrl,
passport.authenticate("local", {
    failureRedirect:'/login',
    failureFlash:true,
}),
userController.logIn
);



router.get("/logout", userController.LogOut);


module.exports = router;