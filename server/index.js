const express = require("express");
const socket = require("socket.io");
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

let server = app.listen(process.env.PORT || 3000, () => {
  console.log("running");
});

let io = socket(server);

io.on("connection", (socket) => {
  console.log("socket connected");

  socket.on("get", (req) => {
    users.findOne({ email: req.email }, (err, item) => {
      if (req.pass == item.pass) {
        let data = {};

        if (req.status) {
          if (req.status == "email") {
            data.email = req.email;
          } else {
            data.status = req.status;
          }
        }

        if (req.topic) {
          data.topic = req.topic;
        }

        if (req.module && req.topic && req.topic != "common") {
          data.module = req.module;
        }

        if (req.quest) {
          data["$text"] = {};
          data["$text"]["$search"] = req.quest;
          questions
            .find(data)
            .sort({ time: req.status == "unsolved" ? 1 : -1 })
            .toArray((err, items) => {
              if (err) {
                io.to(socket.id).emit("get", { status: false });
              } else {
                io.to(socket.id).emit("get", items);
              }
            });
        } else {
          questions.find(data).toArray((err, items) => {
            if (err) {
              io.to(socket.id).emit("get", { status: "false" });
            } else {
              io.to(socket.id).emit("get", items);
            }
          });
        }
      } else {
        io.to(socket.id).emit("get", { status: "false" });
      }
    });
  });

  socket.on("get_one", (req) => {
    users.findOne({ email: req.email }, (err, item) => {
      if (req.pass == item.pass) {
        questions.findOne({ question: req.question }, (err, item1) => {
          if (err || !item1) {
            io.to(socket.id).emit("get_one", { status: "false" });
          } else {
            details.findOne({ question: req.question }, (err, item2) => {
              if (err || !item2) {
                io.to(socket.id).emit("get_one", { status: "false" });
              } else {
                delete item2.question;
                io.to(socket.id).emit("get_one", { ...item1, ...item2 });
              }
            });
          }
        });
      } else {
        io.to(socket.id).emit("get_one", { status: "false" });
      }
    });
  });

  socket.on("get_details", (req) => {
    users.findOne({ email: req.email }, (err, item) => {
      if (req.pass == item.pass) {
        details.findOne({ question: req.question }, (err, item) => {
          if (err) {
            io.to(socket.id).emit("get_details", { status: "false" });
          } else {
            io.to(socket.id).emit("get_details", { ...item });
          }
        });
      } else {
        rio.to(socket.id).emit("get_details", { status: "false" });
      }
    });
  });

  socket.on("set", (req) => {
    users.findOne({ email: req.email }, (err, item) => {
      if (req.pass == item.pass) {
        questions
          .find({
            question: req.question,
          })
          .toArray((err, items) => {
            if (err) {
              io.to(socket.id).emit("set", { status: "false" });
            } else {
              if (items.length) {
                io.to(socket.id).emit("set", { status: "check" });
              } else {
                questions.insertOne(
                  {
                    question: req.question,
                    description: req.description,
                    status: "unsolved",
                    email: req.email,
                    topic: req.topic,
                    module: req.module,
                    time: req.time,
                  },
                  (err, result) => {
                    if (err) {
                      io.to(socket.id).emit("set", { status: "false" });
                    } else {
                      subscribe.insertOne(
                        {
                          question: req.question,
                          email: [req.email],
                        },
                        (err, result) => {
                          if (err) {
                            io.to(socket.id).emit("set", { status: "false" });
                          } else {
                            details.insertOne(
                              {
                                question: req.question,
                                answer: "",
                                atime: "",
                                aemail: "",
                                comments: [],
                              },
                              (err, result) => {
                                if (err) {
                                  io.to(socket.id).emit("set", {
                                    status: "false",
                                  });
                                } else {
                                  io.to(socket.id).emit("set", {
                                    status: "true",
                                  });
                                  io.sockets.emit("updated");
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
        io.to(socket.id).emit("set", { status: "false" });
      }
    });
  });

  socket.on("update", (req) => {
    users.findOne({ email: req.aemail }, (err, item) => {
      if (req.pass == item.pass) {
        details.findOne({ question: req.question }, (err, item) => {
          if (err) {
            io.to(socket.id).emit("update", { status: "false" });
          } else {
            if (item.answer) {
              io.to(socket.id).emit("update", { status: "check" });
            } else {
              details.updateOne(
                { question: req.question },
                {
                  $set: {
                    answer: req.answer,
                    atime: req.atime,
                    aemail: req.aemail,
                  },
                },
                (err, item) => {
                  if (err) {
                    io.to(socket.id).emit("update", { status: "false" });
                  } else {
                    questions.updateOne(
                      { question: req.question },
                      {
                        $set: {
                          status: "solved",
                        },
                      },
                      (err, item) => {
                        if (err) {
                          io.to(socket.id).emit("update", { status: "false" });
                        } else {
                          subscribe.findOne(
                            { question: req.question },
                            (err, item) => {
                              item.email.forEach((email) => {
                                transporter.sendMail({
                                  from: "gcekcse2020@gmail.com",
                                  to: email,
                                  subject: "Your Doubt Is Solved",
                                  text:
                                    "Question: " +
                                    req.question +
                                    "\n" +
                                    "Check Your Answer Here: " +
                                    `https://gcekcse2020.herokuapp.com/?q=${encodeURIComponent(
                                      req.question
                                    )}`,
                                });
                                io.to(socket.id).emit("update", {
                                  status: "true",
                                });
                                io.sockets.emit("updated");
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
        io.to(socket.id).emit("update", { status: "false" });
      }
    });
  });

  socket.on("subscribe", (req) => {
    users.findOne({ email: req.email }, (err, item) => {
      if (req.pass == item.pass) {
        subscribe.findOne({ question: req.question }, (err, item) => {
          if (err) {
            io.to(socket.id).emit("subscribe", { status: "false" });
          } else {
            subscribe.updateOne(
              { question: req.question },
              {
                $set: {
                  email: [...item.email, req.email],
                },
              },
              (err, item) => {
                if (err) {
                  io.to(socket.id).emit("subscribe", { status: "false" });
                } else {
                  io.to(socket.id).emit("subscribe", { status: "true" });
                }
              }
            );
          }
        });
      } else {
        io.to(socket.id).emit("subscribe", { status: "false" });
      }
    });
  });

  socket.on("wrong", (req) => {
    users.findOne({ email: req.email }, (err, item) => {
      if (req.pass == item.pass) {
        transporter.sendMail(
          {
            from: "gcekcse2020@gmail.com",
            to: "gcekcse2020@gmail.com",
            subject: "Answer Is Wrong",
            text: req.question + "\n" + req.email,
          },
          (err, data) => {
            io.to(socket.id).emit("wrong", { status: "true" });
          }
        );
      } else {
        io.to(socket.id).emit("wrong", { status: "false" });
      }
    });
  });

  socket.on("delete", async (req, res) => {
    users.findOne({ email: req.email }, (err, item) => {
      if (req.pass == item.pass) {
        questions.deleteOne({ question: req.question }, (err, item) => {
          if (err) {
            io.to(socket.id).emit("delete", { status: "false" });
          } else {
            subscribe.deleteOne({ question: req.question }, (err, item) => {
              if (err) {
                io.to(socket.id).emit("delete", { status: "false" });
              } else {
                details.deleteOne({ question: req.question }, (err, item) => {
                  if (err) {
                    io.to(socket.id).emit("delete", { status: "false" });
                  } else {
                    io.to(socket.id).emit("delete", { status: "true" });
                    io.sockets.emit("updated");
                  }
                });
              }
            });
          }
        });
      } else {
        io.to(socket.id).emit("delete", { status: "false" });
      }
    });
  });

  socket.on("delete_answer", (req) => {
    users.findOne({ email: req.email }, (err, item) => {
      if (req.pass == item.pass) {
        details.updateOne(
          { question: req.question },
          {
            $set: {
              answer: "",
              atime: "",
              aemail: "",
            },
          },
          (err, item) => {
            if (err) {
              io.to(socket.id).emit("delete_answer", { status: "false" });
            } else {
              questions.updateOne(
                { question: req.question },
                {
                  $set: {
                    status: "unsolved",
                  },
                },
                (err, item) => {
                  if (err) {
                    io.to(socket.id).emit("delete_answer", { status: "false" });
                  } else {
                    io.to(socket.id).emit("delete_answer", { status: "true" });
                    io.sockets.emit("updated");
                  }
                }
              );
            }
          }
        );
      } else {
        io.to(socket.id).emit("delete_answer", { status: "false" });
      }
    });
  });

  socket.on("add_comment", (req) => {
    users.findOne({ email: req.email }, (err, item) => {
      if (req.pass == item.pass) {
        details.findOne({ question: req.question }, (err, item) => {
          if (err) {
            io.to(socket.id).emit("add_comment", { status: "false" });
          } else {
            if (item.comments.includes(req.comment)) {
              io.to(socket.id).emit("add_comment", { status: "check" });
            } else {
              details.updateOne(
                { question: req.question },
                {
                  $set: {
                    comments: [req.comment, ...item.comments],
                  },
                },
                (err, item) => {
                  if (err) {
                    io.to(socket.id).emit("add_comment", { status: "false" });
                  } else {
                    io.to(socket.id).emit("add_comment", { status: "true" });
                    io.sockets.emit("comments_updated");
                  }
                }
              );
            }
          }
        });
      } else {
        io.to(socket.id).emit("add_comment", { status: "false" });
      }
    });
  });
});
