const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Hello From the server !!");
});

app.use("/", (req, res) => {
  res.send("Welcome to Your Dashboard!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
