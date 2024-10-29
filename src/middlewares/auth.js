const User = require("../models/user");
var jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log("token " + token);
    if (!token) throw new Error("Token not found. Please login Again!!");

    const decodeObj = jwt.decode(token, "devTinder#051");
    const id = decodeObj._id;

    const user = await User.findOne({ _id: id });
    if (!user) throw new Error("Token not valid");

    //Add user to the req object and call next()
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = {
  userAuth,
};
