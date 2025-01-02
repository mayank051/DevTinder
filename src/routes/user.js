const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
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

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //Add pagination support from query params
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    if (limit > 50) limit = 50;

    let skip = (page - 1) * limit;

    //Find all the connection list(fromUserId, touserId) for loggedInUser (Interested/Ignored/Accepted/Rejected)
    const connectionList = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
        },
      ],
    }).select(["fromUserId", "toUserId"]);

    //Create a set that will contain all the userIds that needs to be hidden
    const hiddenUserIds = new Set();
    connectionList.forEach((connection) => {
      hiddenUserIds.add(connection.fromUserId.toString());
      hiddenUserIds.add(connection.toUserId.toString());
    });

    //Find all users that are not in the hiddenUserIds Array with pagination support
    const feedUserList = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hiddenUserIds) },
        },
        {
          _id: { $ne: loggedInUser._id },
        },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    const feedUserCount = feedUserList.length;

    res.status(200).json({ value: feedUserList, count: feedUserCount });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
