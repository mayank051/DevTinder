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

//POST API to review(accept/reject) connection Request
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const status = req.params.status;
      const requestId = req.params.requestId;

      const validStatus = ["accepted", "rejected"];
      if (!validStatus.includes(status))
        return res.status(400).json({ message: "Invalid status type!" });

      //Find a connectionRequest with requestId & request is for loggedinUser only & status should be interested only
      const connectionReq = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: user._id,
        status: "interested",
      });

      //throw an error if connection request doesn't exists
      if (!connectionReq)
        return res
          .status(400)
          .json({ message: "Connection Request not found" });

      //Update the status of connectionRequest to accepted or rejcted
      connectionReq.status = status;
      const data = await connectionReq.save();
      return res.status(200).json({
        message: "Connection Request " + connectionReq.status,
        data: data,
      });

      res.status(400).json({ message: "Invalid Request !" });
    } catch (err) {
      res.status(400).send("Error: " + err.meessage);
    }
  }
);

module.exports = requestRouter;
