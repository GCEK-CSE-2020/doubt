const express = require("express");
const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");
require("dotenv").config();

const client = new MongoClient(
  "mongodb+srv://team:" +
    process.env.PASS +
    "@cluster0.sxquf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useUnifiedTopology: true }
);
let questions;
let transporter;
let pass = "donotshare";

async function run() {
  try {
    await client.connect();
    questions = await client.db("cluster0").collection("questions");

    transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gcekcse2020",
        pass: process.env.PASS,
      },
    });
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

app.post("/check", async (req, res) => {
  if (req.body.pass == "don'tshare") {
    if (
      req.body.email.toLowerCase().split("@")[1] == "gcek.ac.in" ||
      req.body.email.toLowerCase() == "gcekcse2020@gmail.com"
    ) {
      res.send({ status: "true" });
    } else {
      res.status(404).send({ status: "false" });
    }
  } else {
    res.status(404).send({ status: "false" });
  }
});

app.post("/get_solved", async (req, res) => {
  if (req.body.pass == pass) {
    questions
      .find({
        status: "solved",
        topic: req.body.topic,
        module: req.body.module,
      })
      .toArray((err, items) => {
        if (err) {
          res.send({ status: "false" });
        }

        res.send(items);
      });
  } else {
    res.status(404).send({ status: "false" });
  }
});

app.post("/get_unsolved", async (req, res) => {
  if (req.body.pass == pass) {
    questions
      .find({
        status: "unsolved",
        topic: req.body.topic,
        module: req.body.module,
      })
      .toArray((err, items) => {
        if (err) {
          res.send({
            status: "false",
          });
        }

        res.send(items);
      });
  } else {
    res.status(404).send({ status: "false" });
  }
});

app.post("/set", async (req, res) => {
  if (req.body.pass == pass) {
    questions
      .find({
        question: req.body.question,
      })
      .toArray((err, items) => {
        if (err) {
          res.send({ status: "false" });
        } else {
          if (items) {
            res.send({ status: "check" });
          } else {
            questions.insertOne(
              {
                question: req.body.question,
                time: req.body.time,
                answer: "",
                atime: "",
                status: "unsolved",
                topic: req.body.topic,
                module: req.body.module,
                email: req.body.email,
                aemail: "",
              },
              (err, result) => {
                if (err) {
                  res.send({ status: "false" });
                } else {
                  res.send({ status: "true" });
                }
              }
            );
          }
        }
      });
  } else {
    res.status(404).send({ status: "false" });
  }
});

app.post("/update", async (req, res) => {
  if (req.body.pass == pass) {
    questions.updateOne(
      { question: req.body.question },
      {
        $set: {
          answer: req.body.answer,
          atime: req.body.atime,
          status: "solved",
          aemail: req.body.aemail,
        },
      },
      (err, item) => {
        if (err) {
          res.send({ status: "false" });
        } else {
          questions.findOne({ question: req.body.question }, (err, item) => {
            transporter.sendMail(
              {
                from: "gcekcse2020@gmail.com",
                to: item.email,
                subject: "Your Doubt Is Solved",
                text:
                  "Questions: " +
                  item.question +
                  "\n" +
                  "Answer: " +
                  item.answer,
              },
              (err, data) => {
                res.send({ status: "true" });
              }
            );
          });
        }
      }
    );
  } else {
    res.status(404).send({ status: "false" });
  }
});

app.post("/wrong", async (req, res) => {
  if (req.body.pass == pass) {
    transporter.sendMail(
      {
        from: "gcekcse2020@gmail.com",
        to: "gcekcse2020@gmail.com",
        subject: "Answer Is Wrong",
        text: req.body.question + "\n" + req.body.email,
      },
      (err, data) => {
        res.send({ status: "true" });
      }
    );
  } else {
    res.status(404).send({ status: "false" });
  }
});

app.post("/delete_answer", async (req, res) => {
  if (req.body.pass == pass) {
    questions.updateOne(
      { question: req.body.question },
      {
        $set: {
          answer: "",
          status: "unsolved",
          aemail: "",
        },
      },
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
