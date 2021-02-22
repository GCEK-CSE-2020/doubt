const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(
  "mongodb+srv://team:" +
    process.env.PASS +
    "@cluster0.sxquf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useUnifiedTopology: true }
);
let questions;

async function run() {
  try {
    await client.connect();
    questions = client.db("cluster0").collection("questions");
  } catch (err) {
    console.log(err);
  }
}
run();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome");
});

app.get("/get_solved", async (req, res) => {
  questions.find({ status: "solved" }).toArray((err, items) => {
    if (err) {
      res.send({ status: "false" });
    }

    res.send(items);
  });
});

app.get("/get_unsolved", async (req, res) => {
  questions.find({ status: "unsolved" }).toArray((err, items) => {
    if (err) {
      res.send({ status: "false" });
    }

    res.send(items);
  });
});

app.post("/set", async (req, res) => {
  if (req.body.pass == "donotshare") {
    questions.insertOne(
      { question: req.body.question, answer: "", status: "unsolved" },
      (err, result) => {
        if (err) {
          res.send({ status: "false" });
        } else {
          res.send({ status: "true" });
        }
      }
    );
  } else {
    res.status(404).send({ status: "false" });
  }
});

app.post("/update", async (req, res) => {
  if (req.body.pass == "donotshare") {
    questions.updateOne(
      { question: req.body.question },
      { $set: { answer: req.body.answer, status: "solved" } },
      (err, item) => {
        if (err) {
          res.send({ status: "false" });
        } else {
          res.send({ status: "true" });
        }
      }
    );
  } else {
    res.status(404).send({ status: "false" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("running");
});
