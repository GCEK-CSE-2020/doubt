const express = require("express");
const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const path = require("path");

const client = new MongoClient(
  "mongodb+srv://gcekcse2020:" +
    process.env.PASS +
    "@forum.8jnnl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useUnifiedTopology: true }
);
let questions;
let data;
let comments;
let users;
let transporter;

async function run() {
  try {
    await client.connect();

    let db = await client.db("cluster0");
    questions = await db.collection("questions");
    data = await db.collection("data");
    comments = await db.collection("comments");
    users = await db.collection("users");
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

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
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

app.post("/change", async (req, res) => {
  users.findOne({ email: req.body.email }, async (err, item) => {
    if (err || !item) {
      res.status(404).send({ status: "false" });
    } else {
      let isMatch = await bcrypt.compare(req.body.pass, item.pass);

      if (isMatch) {
        let newPass = await bcrypt.hash(req.body.newPass, 8);
        users.updateOne(
          { email: req.body.email },
          { $set: { pass: newPass } },
          (err, item) => {
            if (err) {
              res.send({ status: "false" });
            } else {
              res.send({ status: "true", api: newPass });
            }
          }
        );
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
        questions
          .find(data)
          .sort({ _id: req.body.status == "unsolved" ? 1 : -1 })
          .toArray((err, items) => {
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
                          comments.insertOne(
                            {
                              question: req.body.question,
                              comments: [],
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
                                req.body.question +
                                "\n" +
                                "Answer: " +
                                req.body.answer,
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

app.post("/get_comments", async (req, res) => {
  users.findOne({ email: req.body.email }, (err, item) => {
    if (req.body.pass == item.pass) {
      comments.findOne({ question: req.body.question }, (err, item) => {
        if (err) {
          res.send({ status: "false" });
        } else {
          res.send({ status: "true", comments: item.comments });
        }
      });
    } else {
      res.status(404).send({ status: "false" });
    }
  });
});

app.post("/add_comment", async (req, res) => {
  users.findOne({ email: req.body.email }, (err, item) => {
    if (req.body.pass == item.pass) {
      comments.findOne({ question: req.body.question }, (err, item) => {
        if (err) {
          res.send({ status: "false" });
        } else {
          if (item.comments.includes(req.body.comment)) {
            res.send({ status: "check" });
          } else {
            comments.updateOne(
              { question: req.body.question },
              {
                $set: {
                  comments: [req.body.comment, ...item.comments],
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
        }
      });
    } else {
      res.status(404).send({ status: "false" });
    }
  });
});

app.post("/delete_comment", async (req, res) => {
  users.findOne({ email: req.body.email }, (err, item) => {
    if (req.body.pass == item.pass) {
      comments.findOne({ question: req.body.question }, (err, item) => {
        if (err) {
          res.send({ status: "false" });
        } else {
          const func = (comments, comment) => {
            comments.splice(comments.indexOf(comment), 1);
            return comments;
          };

          comments.updateOne(
            { question: req.body.question },
            {
              $set: {
                comments: func(item.comments, req.body.comment),
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

app.listen(process.env.PORT || 3000, () => {
  console.log("running");
});
