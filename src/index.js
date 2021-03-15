const express = require("express");
var cors = require("cors");
const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const client = new MongoClient(
  "mongodb+srv://gcekcse2020:" +
    process.env.PASS +
    "@forum.8jnnl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useUnifiedTopology: true }
);
let questions;
let data;
let users;
let transporter;

async function run() {
  try {
    await client.connect();

    let db = await client.db("cluster0");
    questions = await db.collection("questions");
    data = await db.collection("data");
    users = await db.collection("users");
    await questions.createIndex({ question: "text", description: "text" });
    `20B052,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B060,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B117,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B394,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B395,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B371,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B055,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B713,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B216,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B166,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B433,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B680,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B722,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B247,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B705,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B253,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B397,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B372,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B333,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B336,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B315,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B045,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B291,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B723,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B228,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B742,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B399,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B604,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20b744,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B337,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B292,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B153,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B691,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B236,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B082,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B124,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B401,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B323,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B343,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B390,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B471,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B051,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B466,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B431,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B219,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B692,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B669,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B739,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B314,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B067,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B331,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B108,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B607,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B217,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B308,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B597,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B392,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B347,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B404,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B694,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B374,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B053,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20B284,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20b315,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20b470,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20b410,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
20b743
`
      .split(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n")
      .forEach((id) => {
        users.insertOne({
          email: id.toLowerCase() + "@gcek.ac.in",
          pass: "$2b$08$3bfZoz7ucouRfd8tJMN/Eepbjs9UJ0N2ukmaWJniig.GbonIvh.tK",
        });
      });

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
  users.findOne({ email: req.body.email }, async (err, item) => {
    if (err || !item) {
      res.status(404).send({ status: "false" });
    } else {
      let isMatch = await bcrypt.compare(req.body.pass, item.pass);

      if (isMatch) {
        res.send({ status: "true", api: item.pass });
      } else {
        res.status(404).send({ status: "false" });
      }
    }
  });
});

app.post("/get", async (req, res) => {
  users.findOne({ email: req.body.email }, (err, item) => {
    if (req.body.pass == item.pass) {
      let data = {};

      if (req.body.status) {
        data.status = req.body.status;
      }

      if (req.body.topic) {
        data.topic = req.body.topic;
      }

      if (req.body.module) {
        data.module = req.body.module;
      }

      if (req.body.quest) {
        data["$text"] = {};
        data["$text"]["$search"] = req.body.quest;
        questions.find(data).toArray((err, items) => {
          if (err) {
            res.send({ status: false });
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
});

app.post("/set", async (req, res) => {
  users.findOne({ email: req.body.email }, (err, item) => {
    if (req.body.pass == item.pass) {
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
                  email: req.body.email,
                  time: req.body.time,
                  answer: "",
                  atime: "",
                  aemail: "",
                  status: "unsolved",
                  topic: req.body.topic,
                  module: req.body.module,
                },
                (err, result) => {
                  if (err) {
                    res.send({ status: "false" });
                  } else {
                    data.insertOne(
                      {
                        question: req.body.question,
                        email: [req.body.email],
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
              );
            }
          }
        });
    } else {
      res.status(404).send({ status: "false" });
    }
  });
});

app.post("/update", async (req, res) => {
  users.findOne({ email: req.body.aemail }, (err, item) => {
    if (req.body.pass == item.pass) {
      questions.findOne(
        {
          question: req.body.question,
        },
        (err, item) => {
          if (err) {
            res.send({ status: "false" });
          } else {
            if (item.answer) {
              res.send({ status: "check" });
            } else {
              questions.updateOne(
                { question: req.body.question },
                {
                  $set: {
                    answer: req.body.answer,
                    atime: req.body.atime,
                    aemail: req.body.aemail,
                    status: "solved",
                  },
                },
                (err, item) => {
                  if (err) {
                    res.send({ status: "false" });
                  } else {
                    data.findOne(
                      { question: req.body.question },
                      (err, item) => {
                        item.email.forEach((email) => {
                          transporter.sendMail(
                            {
                              from: "gcekcse2020@gmail.com",
                              to: email,
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
                    );
                  }
                }
              );
            }
          }
        }
      );
    } else {
      res.status(404).send({ status: "false" });
    }
  });
});

app.post("/subscribe", async (req, res) => {
  users.findOne({ email: req.body.email }, (err, item) => {
    if (req.body.pass == item.pass) {
      data.findOne({ question: req.body.question }, (err, item) => {
        if (err) {
          res.send({ status: "false" });
        } else {
          data.updateOne(
            { question: req.body.question },
            {
              $set: {
                email: [...item.email, req.body.email],
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
        }
      });
    } else {
      res.status(404).send({ status: "false" });
    }
  });
});

app.post("/wrong", async (req, res) => {
  users.findOne({ email: req.body.email }, (err, item) => {
    if (req.body.pass == item.pass) {
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
});

app.post("/delete", async (req, res) => {
  users.findOne({ email: req.body.email }, (err, item) => {
    if (req.body.pass == item.pass) {
      questions.deleteOne({ question: req.body.question }, (err, item) => {
        if (err) {
          res.send({ status: "false" });
        } else {
          data.deleteOne({ question: req.body.question }, (err, item) => {
            if (err) {
              res.send({ status: "false" });
            } else {
              res.send({ status: "true" });
            }
          });
        }
      });
    } else {
      res.status(404).send({ status: "false" });
    }
  });
});

app.post("/delete_answer", async (req, res) => {
  users.findOne({ email: req.body.email }, (err, item) => {
    if (req.body.pass == item.pass) {
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
          } else {
            res.send({ status: "true" });
          }
        }
      );
    } else {
      res.status(404).send({ status: "false" });
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("running");
});
