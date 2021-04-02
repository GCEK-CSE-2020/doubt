const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(
  "mongodb+srv://gcekcse2020:" +
    process.env.PASS +
    "@forum.8jnnl.mongodb.net/cluster0?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.connection.on("connected", function () {
  console.log("Mongoose Connected");
});

mongoose.connection.on("error", function (err) {
  console.log("Mongoose default connection error: " + err);
});

mongoose.connection.on("disconnected", function () {
  console.log("Mongoose default connection disconnected");
});

process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

const Users = mongoose.model("users", {
  email: String,
  pass: String,
});

const Questions = mongoose.model("questions", {
  question: String,
  description: String,
  status: String,
  email: String,
  topic: String,
  module: String,
  time: Number,
});

const Details = mongoose.model("details", {
  question: String,
  answer: String,
  atime: String,
  aemail: String,
  comments: Array,
});

const Subscribe = mongoose.model("subscribe", {
  question: String,
  email: Array,
});

module.exports = { Users, Questions, Details, Subscribe };
