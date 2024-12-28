const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

//POST API to send connection Request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      if (!toUserId) throw new Error("userId is missing");

      //send request can only have ['interested', 'ignored'];
      const validStatus = ["interested", "ignored"];
      if (!validStatus.includes(status))
        res.status(400).json({ messgae: "Invalid status type!" });

      //Check if the toUserId is present in db
      const targetUser = await User.findById(toUserId);
      if (!targetUser)
        return res.status(404).json({ message: "User not found !" });

      //Check if the connection request already exist(A->B or B->A)
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId: fromUserId,
            toUserId: toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "connection request already exists!",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: status,
      });
      const request = await connectionRequest.save();

      return res.json({
        message: "Connection Request Sent successfully",
        data: request,
      });
    } catch (err) {
      res.status(400).send("Error: " + (err.meessage || err));
    }
  }
);

module.exports = requestRouter;
