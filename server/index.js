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
let details;
let subscribe;
let users;
let transporter;

async function run() {
  try {
    await client.connect();

    let db = await client.db("cluster0");
    questions = await db.collection("questions");
    details = await db.collection("details");
    subscribe = await db.collection("subscribe");
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
        if (req.body.status == "email") {
          data.email = req.body.email;
        } else {
          data.status = req.body.status;
        }
      }

      if (req.body.topic) {
        data.topic = req.body.topic;
      }

      if (req.body.module && req.body.topic && req.body.topic != "common") {
        data.module = req.body.module;
      }

      if (req.body.quest) {
        data["$text"] = {};
        data["$text"]["$search"] = req.body.quest;
        questions
          .find(data)
          .sort({ time: req.body.status == "unsolved" ? 1 : -1 })
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

app.post("/get_one", async (req, res) => {
  users.findOne({ email: req.body.email }, (err, item) => {
    if (req.body.pass == item.pass) {
      questions.findOne({ question: req.body.question }, (err, item1) => {
        if (err) {
          res.send({ status: "false" });
        } else {
          details.findOne({ question: req.body.question }, (err, item2) => {
            if (err) {
              res.send({ status: "false" });
            } else {
              delete item2.question;
              res.send({ ...item1, ...item2 });
            }
          });
        }
      });
    } else {
      res.status(404).send({ status: "false" });
    }
  });
});

app.post("/get_details", async (req, res) => {
  users.findOne({ email: req.body.email }, (err, item) => {
    if (req.body.pass == item.pass) {
      details.findOne({ question: req.body.question }, (err, item) => {
        if (err) {
          res.send({ status: "false" });
        } else {
          res.send({ ...item });
        }
      });
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
            if (items.length) {
              res.send({ status: "check" });
            } else {
              questions.insertOne(
                {
                  question: req.body.question,
                  description: req.body.description,
                  status: "unsolved",
                  topic: req.body.topic,
                  module: req.body.module,
                  time: req.body.time,
                },
                (err, result) => {
                  if (err) {
                    res.send({ status: "false" });
                  } else {
                    subscribe.insertOne(
                      {
                        question: req.body.question,
                        email: [req.body.email],
                      },
                      (err, result) => {
                        if (err) {
                          res.send({ status: "false" });
                        } else {
                          details.insertOne(
                            {
                              question: req.body.question,
                              email: req.body.email,
                              answer: "",
                              atime: "",
                              aemail: "",
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
      details.findOne({ question: req.body.question }, (err, item) => {
        if (err) {
          res.send({ status: "false" });
        } else {
          if (item.answer) {
            res.send({ status: "check" });
          } else {
            details.updateOne(
              { question: req.body.question },
              {
                $set: {
                  answer: req.body.answer,
                  atime: req.body.atime,
                  aemail: req.body.aemail,
                },
              },
              (err, item) => {
                if (err) {
                  res.send({ status: "false" });
                } else {
                  questions.updateOne(
                    { question: req.body.question },
                    {
                      $set: {
                        status: "solved",
                      },
                    },
                    (err, item) => {
                      if (err) {
                        res.send({ status: "false" });
                      } else {
                        subscribe.findOne(
                          { question: req.body.question },
                          (err, item) => {
                            item.email.forEach((email) => {
                              transporter.sendMail(
                                {
                                  from: "gcekcse2020@gmail.com",
                                  to: email,
                                  subject: "Your Doubt Is Solved",
                                  text:
                                    "Question: " +
                                    req.body.question +
                                    "\n" +
                                    "Check Your Answer Here: " +
                                    `https://${req.get(
                                      "host"
                                    )}?q=${encodeURIComponent(
                                      req.body.question
                                    )}`,
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
            );
          }
        }
      });
    } else {
      res.status(404).send({ status: "false" });
    }
  });
});

app.post("/subscribe", async (req, res) => {
  users.findOne({ email: req.body.email }, (err, item) => {
    if (req.body.pass == item.pass) {
      subscribe.findOne({ question: req.body.question }, (err, item) => {
        if (err) {
          res.send({ status: "false" });
        } else {
          subscribe.updateOne(
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
          subscribe.deleteOne({ question: req.body.question }, (err, item) => {
            if (err) {
              res.send({ status: "false" });
            } else {
              details.deleteOne(
                { question: req.body.question },
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
      details.updateOne(
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

app.post("/add_comment", async (req, res) => {
  users.findOne({ email: req.body.email }, (err, item) => {
    if (req.body.pass == item.pass) {
      details.findOne({ question: req.body.question }, (err, item) => {
        if (err) {
          res.send({ status: "false" });
        } else {
          if (item.comments.includes(req.body.comment)) {
            res.send({ status: "check" });
          } else {
            details.updateOne(
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

app.listen(process.env.PORT || 3000, () => {
  console.log("running");
});
