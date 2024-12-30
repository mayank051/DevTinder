const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

//You can create index to optimize db query
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//This is a middleware which will be executed before save
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //Check if fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    const err = new Error("Cannot send connection Request to yourself");
    next(err);
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequests",
  connectionRequestSchema
);
module.exports = ConnectionRequest;
