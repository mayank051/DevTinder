const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "photoUrl",
  "about",
  "age",
  "skills",
];

//Get all pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //Find all the entries with status as interested and toUserId is loggedin user
    const list = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    res.status(200).json({ value: list });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//Get all the connections for the loggedIn user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    //Find all the entries with status accepted where loggedIn user is either fromUser or toUser, also
    //Populate the fromuser & toUser details using the populate method and ref in model
    const connections = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    //Prepare the required data to be sent - Connection Person details
    const data = connections.map((connection) => {
      if (connection.toUserId.equals(loggedInUser._id))
        return connection.fromUserId;
      return connection.toUserId;
    });

    res.status(200).send({
      data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
