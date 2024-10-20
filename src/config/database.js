const mongoose = require("mongoose");

const connectDB = async function () {
  await mongoose.connect(
    "mongodb+srv://mayankcourses051:********@nodeproject.60kul.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
