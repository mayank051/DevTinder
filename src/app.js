const express = require("express");

const app = express();

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

app.get("/user", (req, res) => {
  res.send({
    firstName: "Mayank",
    lastName: "Raj",
  });
});

app.post("/user", (req, res) => {
  //DB query to add user
  res.send("Added User successfully");
});

app.delete("/user", (req, res) => {
  //DB query to delete the user
  res.send("User Deleted successfully!");
});

app.use("/", (req, res) => {
  res.send("Welcome to Your Dashboard!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
