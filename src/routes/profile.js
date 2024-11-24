const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { validateProfileEditData } = require("../utils/validation");

//GET API for getting logged in user profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isValidEditRequest = validateProfileEditData(req.body);
    if (!isValidEditRequest) throw new Error("Invalid Edit Request");

    const loggedinUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedinUser[key] = req.body[key]));
    await loggedinUser.save();
    res.json({
      message: `${loggedinUser.firstName} Profile updated successfully !`,
      data: loggedinUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const existingPassword = req.body.password;
    const newPassword = req.body.newPassword;

    const user = req.user;
    const isCurrentPasswordValid = await user.validatePassword(
      existingPassword
    );
    if (!isCurrentPasswordValid)
      throw new Error("Please enter Existing password correctly !");

    if (!validator.isStrongPassword(newPassword))
      throw new Error("Please provide a strong password");

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.password = newPasswordHash;
    await user.save();
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Password updated successfully ! Please login again to continue!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
