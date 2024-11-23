const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

//POST API to send connection Request
requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    const user = req.user;
    //TODO: Write logic to send the connection request

    res.send("Request sent by " + user.firstName);
  } catch (err) {
    res.status(400).send("Error: " + err.meessage);
  }
});

module.exports = requestRouter;
