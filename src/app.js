const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const User = require("./models/user");
const { userAuth } = require("./middlewares/auth");
const { validateSignupData } = require("./utils/validation");

const app = express();

//middleware to read the request JSON and convert it to Javascript Object
app.use(express.json());
//For handling cookies
app.use(cookieParser());

//POST API for signing up user
app.post("/signup", async (req, res, next) => {
  try {
    //Add API validation
    validateSignupData(req.body);
    const { firstName, lastName, emailId, password, gender } = req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      gender,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User Added successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//POST API for login a user
app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Invalid Credentials");

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) throw new Error("Invalid Credentials");

    //Generate a JWT
    const token = user.getJWT();
    res.cookie("token", token);
    res.send("Login Successfull !!!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//GET API for getting logged in user profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//POST API to send connection Request
app.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    const user = req.user;
    //TODO: Write logic to send the connection request

    res.send("Request sent by " + user.firstName);
  } catch (err) {
    res.status(400).send("Error: " + err.meessage);
  }
});

//GET API to get all the list of users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("Error Occurred" + err.message);
  }
});

//Patch API for updating the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const allowedKeys = ["about", "photoUrl", "skills", "password"];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      allowedKeys.includes(key)
    );
    if (!isUpdateAllowed)
      throw new Error("Update not Allowed for given fields");
    await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("User Updated successfully");
  } catch (err) {
    res.status(400).send("Error Occurred" + err.message);
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
    res.status(400).send("Error Occurred" + e.message);
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
