const User = require("../models/user");
var jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).send("Please Login to continue");

    const decodeObj = jwt.decode(token, process.env.JWT_SECRET);
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
