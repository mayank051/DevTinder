const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");

//POST API for signing up user
authRouter.post("/signup", async (req, res, next) => {
  try {
    //Add API validation
    validateSignupData(req.body);
    const { firstName, lastName, emailId, password, gender } = req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      gender,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User Added successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//POST API for login a user
authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Invalid Credentials");

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) throw new Error("Invalid Credentials");

    //Generate a JWT
    const token = user.getJWT();
    res.cookie("token", token);
    res.send("Login Successfull !!!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//POST API for logout
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successfull !!!");
});

module.exports = authRouter;
