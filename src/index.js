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

async function run() {
  try {
    await client.connect();
    questions = await client.db("cluster0").collection("questions");

    transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
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

app.post("/get_solved", async (req, res) => {
  if (req.body.pass == "donotshare") {
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
  if (req.body.pass == "donotshare") {
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
  if (req.body.pass == "donotshare") {
    questions.insertOne(
      {
        question: req.body.question,
        answer: "",
        status: "unsolved",
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
  } else {
    res.status(404).send({ status: "false" });
  }
});

app.post("/update", async (req, res) => {
  if (req.body.pass == "donotshare") {
    questions.updateOne(
      { question: req.body.question },
      {
        $set: {
          answer: req.body.answer,
          status: "solved",
          aemail: req.body.aemail,
        },
      },
      (err, item) => {
        if (err) {
          res.send({ status: "false" });
        } else {
          transporter.sendMail({
            from: "gcekcse2020@gmail.com>",
            to: item.email,
            subject: "Your Doubt Is Solved",
            text:
              "Questions: " + item.question + "\n" + "Answer: " + item.answer,
          });
          res.send({ status: "true" });
        }
      }
    );
  } else {
    res.status(404).send({ status: "false" });
  }
});

app.post("/wrong", async (req, res) => {
  if (req.body.pass == "donotshare") {
    transporter.sendMail({
      from: "gcekcse2020@gmail.com>",
      to: "gcekcse2020@gmail.com",
      subject: "Your Doubt Is Solved",
      text: req.body.question + "\n" + req.body.email,
    });
  } else {
    res.status(404).send({ status: "false" });
  }
});

app.post("/delete_answer", async (req, res) => {
  if (req.body.pass == "donotshare") {
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
