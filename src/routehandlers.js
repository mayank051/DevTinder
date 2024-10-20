const express = require("express");

const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");

//You can add multiple route handlers for same route and call the next handler using next().
//But once the response is sent you can't send another response. below are examples-
//app.use('/route', rH, rH2, rH3, rH4, rH5);
//app.use('/route', [rH, rH2], rH3, rH4, rH5);
//app.use('/route', [rH, rH2, rH3, rH4, rH5]);

app.use(
  "/user",
  (req, res, next) => {
    console.log("Hello there user!");
    res.send("Hello User from RH1");
    next();
  },
  (req, res, next) => {
    console.log("Hello there user2!");
    //res.send("Hello User from RH2");
    next();
  }
);

//One more way to do that is to create multiple route handlers itself for same route as below

//Note: All these rount handlers which are not sending the response are called middlewares

app.use("/multipleUsers", (req, res, next) => {
  console.log("Hello From multipleUsers");
  next();
});

app.use("/multipleUsers", (req, res, next) => {
  console.log("Hello From multipleUsers RH2");
  res.send("Response sent from RH2");
  next();
});

//Why Middlewares are needed. - Suppose before sending any response you want to check if user is
//authorised or not. So this logic will be common and can be used by multiple routes. Lets check the example for few Admin APIs

app.use("/admin", adminAuth);

app.use("/admin/getAllData", (req, res, next) => {
  console.log("Inside getAllData");
  res.send("All the Admin Data sent");
});

app.use("/admin/deleteUser", (req, res, next) => {
  res.send("User Deleted successfully");
});

app.post("/users/login", (req, res, next) => {
  res.send("User logged in successfully !!");
});

app.use("/users", userAuth, (req, res, next) => {
  res.send("Users Data Fetched successfully");
});

//Error Handling - Try to wrap all the logics inside try catch but in case some unhandled error occured
app.get("/getUserData", (req, res, next) => {
  throw new Error("Some Error occured");
  res.send("User Data Sent");
});

//Write error handling middleware to the root route so that all unhandled errors are gracefully handled
app.use("/", (err, req, res, next) => {
  res.status(500).send("Something went Wrong");
});

//query parameter
app.get("/test", (req, res) => {
  //For qurey parameter
  console.log(req.query);
  res.send("Hello From the test server !!");
});

//dynamic routes
app.get("/testdynamics/:userid/:password", (req, res) => {
  console.log(req.params);
  res.send("Hello From the test Dynamic route !!");
});

app.listen("3001", () => {
  console.log("Server is started on PORT 3001");
});
