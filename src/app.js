const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
require("dotenv").config();
require("./utils/cronjob");
const cors = require("cors");

//Import Express Routers;
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();

//middleware to read the request JSON and convert it to Javascript Object
app.use(express.json());
//For handling cookies
app.use(cookieParser());

//For handling cors
app.use(
  cors({
    //whitelisting below domain to access the server
    origin: "http://localhost:5173",
    //to set the headers like cookies in browser
    credentials: true,
  })
);

//Add all Route handlers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("DB connected successfully!!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => console.error("Database connection Failed"));
