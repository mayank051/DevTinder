const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res, next) => {
  const user = new User({
    firstName: "Mayank",
    lastName: "Raj",
    email: "mayank@raj.com",
    password: "Mayank@123",
    age: 27,
    gender: "Male",
    randomKey: "xyz",
  });
  try {
    await user.save();
    res.send("User Added successfully");
  } catch (err) {
    console.log("err", err);
    res.status(500).send("Something Went Wrong");
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
