const express = require('express')
const userRouter = express.Router()
const User = require('../models/userModel.js')
const passport = require('passport')
const { getNgos } = require("../controllers/userController");
const {registerUser,loginUser,logOut} = require("../controllers/userController.js")

userRouter.use(express.json());
userRouter.use(express.urlencoded({ extended: true }));
userRouter.get("/test", (req, res) => {
    console.log("Session data:", req.session);  // Check if session data is being set
    console.log("Is authenticated?", req.isAuthenticated());
    console.log("User:", req.user);
    if (req.isAuthenticated()) {
        return res.status(200).send({ success: true, data: req.user });
    }
    return res.status(200).send({ success: false, message: "Not authenticated" });
});
userRouter.post("/signup",registerUser)
userRouter.post("/login",
    passport.authenticate("local",{ failureRedirect: "/login", failureFlash: true }),
    loginUser)
userRouter.get("/ngos", getNgos);    
userRouter.get("/logout",logOut)

module.exports = userRouter;


