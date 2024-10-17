const express = require("express");

const app = express();

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

app.listen("3001", () => {
  console.log("Server is started on PORT 3001");
});
