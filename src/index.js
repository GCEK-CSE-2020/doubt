const express = require("express");
var cors = require("cors");
const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");
require("dotenv").config();

const client = new MongoClient(
  "mongodb+srv://gcekcse2020:" +
    process.env.PASS +
    "@forum.8jnnl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useUnifiedTopology: true }
);
let questions;
let transporter;
let pass = process.env.AUTH;

async function run() {
  try {
    await client.connect();

    let db = await client.db("cluster0");
    questions = await db.collection("questions");
    await questions.createIndex({ question: "text", description: "text" });

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
app.use(cors());
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("welcome");
});

app.post("/check", async (req, res) => {
  if (req.body.pass == process.env.USER) {
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

app.post("/get", async (req, res) => {
  if (req.body.pass == pass) {
    let data = {};

    if (req.body.status) {
      data.status = req.body.status;
    }

    if (req.body.topic) {
      data.status = req.body.topic;
    }

    if (req.body.module) {
      data.status = req.body.module;
    }

    if (req.body.quest) {
      data["$text"] = {};
      data["$search"] = req.body.quest;
      questions
        .find(
          data,
          {
            textScore: {
              $meta: "textScore",
            },
          },
          {
            sort: {
              textScore: {
                $meta: "textScore",
              },
            },
          }
        )
        .toArray((err, items) => {
          if (err) {
            res.send({ status: "false" });
          } else {
            res.send(items);
          }
        });
    } else {
      questions.find(data).toArray((err, items) => {
        if (err) {
          res.send({ status: "false" });
        } else {
          res.send(items);
        }
      });
    }
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
          if (items == []) {
            res.send({ status: "check" });
          } else {
            questions.insertOne(
              {
                question: req.body.question,
                description: req.body.description,
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
                }

                res.send({ status: "true" });
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
          atime: "",
          status: "unsolved",
          aemail: "",
        },
      },
      (err, item) => {
        if (err) {
          res.send({ status: "false" });
        }

        res.send({ status: "true" });
      }
    );
  } else {
    res.status(404).send({ status: "false" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("running");
});
