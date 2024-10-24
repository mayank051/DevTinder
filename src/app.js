const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

//middleware to read the request JSON and convert it to Javascript Object
app.use(express.json());

//POST API for signing up user
app.post("/signup", async (req, res, next) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Added successfully");
  } catch (err) {
    console.log("err", err);
    res.status(500).send("Something Went Wrong");
  }
});

//GET API to get user details by emailId
app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) res.status(404).send("User Not Found");
    res.send(user);
  } catch (e) {
    console.log(e);
    res.status(500).send("Something went wrong!!");
  }
});

//Feed API to get all the list of users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("Something went wrong!");
  }
});

//Patch API for updating the user
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    await User.findByIdAndUpdate(userId, data);
    res.send("User Updated successfully");
  } catch (err) {
    console.log("Mayank", err);
    res.status(500).send("Something went wrong!");
  }
});

//Delete API for removing a user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    console.log("Deleted User", user);
    res.send("User Deleted successfully");
  } catch (e) {
    res.status(500).send("Something went wrong!");
  }
});

connectDB()
  .then(() => {
    console.log("DB connected successfully!!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => console.err("Database connection Failed"));
