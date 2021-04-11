const express = require("express");
const socket = require("socket.io");
const { Users, Questions, Details, Subscribe } = require("./mongoose");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
let server = app.listen(process.env.PORT || 3000, () => {
  console.log("running");
});

let transporter;
async function run() {
  transporter = await nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "gcekcse2020",
      pass: process.env.PASS,
    },
  });
}

run();

const io = socket(server);

const auth = async (email, pass, id, path) => {
  try {
    const result = await Users.findOne({ email: email });
    if (result && pass == result.pass) {
      return Promise.resolve(true);
    } else {
      io.to(id).emit(path, { status: "false" });
      return Promise.resolve(false);
    }
  } catch {
    io.to(id).emit(path, { status: "false" });
    return Promise.resolve(false);
  }
};

io.on("connection", (socket) => {
  console.log("socket connected");
  io.to(socket.id).emit("updated");

  socket.on("check", async (req) => {
    try {
      const result = await Users.findOne({ email: req.email });
      if (result) {
        const isMatch = await bcrypt.compare(req.pass, result.pass);
        if (isMatch) {
          io.to(socket.id).emit("check", { status: "true", api: result.pass });
        } else {
          io.to(socket.id).emit("check", { status: "false" });
        }
      } else {
        io.to(socket.id).emit("check", { status: "false" });
      }
    } catch {
      io.to(socket.id).emit("check", { status: "false" });
    }
  });

  socket.on("change", async (req, res) => {
    try {
      const result = await Users.findOne({ email: req.body.email });
      if (result) {
        const isMatch = await bcrypt.compare(req.pass, result.pass);
        if (isMatch) {
          const newPass = await bcrypt.hash(req.newPass, 8);
          await Users.updateOne(
            { email: req.email },
            { $set: { pass: newPass } }
          );
          io.to(socket.id).emit("change", { status: "true", api: newPass });
        } else {
          io.to(socket.id).emit("change", { status: "false" });
        }
      } else {
        io.to(socket.id).emit("change", { status: "false" });
      }
    } catch {
      io.to(socket.id).emit("change", { status: "false" });
    }
  });

  socket.on("get", async (req) => {
    try {
      const logged = await auth(req.email, req.pass, socket.id, "get");
      if (logged) {
        const data = {};
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
          const items = await Questions.find(data).sort({
            time: req.status == "unsolved" ? 1 : -1,
          });
          io.to(socket.id).emit("get", items);
        } else {
          const items = await Questions.find(data).sort({
            time: req.status == "unsolved" ? 1 : -1,
          });
          io.to(socket.id).emit("get", items);
        }
      }
    } catch {
      io.to(socket.id).emit("get", { status: false });
    }
  });

  socket.on("get_one", async (req) => {
    try {
      const logged = await auth(req.email, req.pass, socket.id, "get_one");
      if (logged) {
        let item1 = await Questions.findOne({ question: req.question });
        let item2 = await Details.findOne({ question: req.question });
        item1 = item1.toObject();
        item2 = item2.toObject();
        delete item1.question;
        delete item1.__v;
        delete item1._id;
        delete item1.__v;
        delete item2._id;
        io.to(socket.id).emit("get_one", Object.assign(item1, item2));
      }
    } catch {
      io.to(socket.id).emit("get_one", { status: "false" });
    }
  });

  socket.on("get_details", async (req) => {
    try {
      const logged = await auth(req.email, req.pass, socket.id, "get_details");
      if (logged) {
        const result = await Details.findOne({ question: req.question });
        io.to(socket.id).emit("get_details", result.toObject());
      }
    } catch {
      io.to(socket.id).emit("get_details", { status: "false" });
    }
  });

  socket.on("set", async (req) => {
    try {
      const logged = await auth(req.email, req.pass, socket.id, "set");
      if (logged) {
        const item = await Questions.findOne({ question: req.question });
        if (item) {
          io.to(socket.id).emit("set", { status: "check" });
        } else {
          const questions = new Questions({
            question: req.question,
            description: req.description,
            status: "unsolved",
            email: req.email,
            topic: req.topic,
            module: req.module,
            time: req.time,
          });
          await questions.save();
          const subscribe = new Subscribe({
            question: req.question,
            email: [req.email],
          });
          await subscribe.save();
          const details = new Details({
            question: req.question,
            answer: "",
            atime: "",
            aemail: "",
            comments: [],
          });
          await details.save();
          io.to(socket.id).emit("set", { status: "true" });
          io.sockets.emit("updated");
        }
      }
    } catch {
      io.to(socket.id).emit("set", { status: "false" });
    }
  });

  socket.on("update", async (req) => {
    try {
      const logged = await auth(req.aemail, req.pass, socket.id, "update");
      if (logged) {
        const result = await Details.findOne({ question: req.question });
        if (result.answer != "") {
          io.to(socket.id).emit("update", { status: "check" });
        } else {
          await Details.updateOne(
            { question: req.question },
            {
              $set: {
                answer: req.answer,
                atime: req.atime,
                aemail: req.aemail,
              },
            }
          );
          await Questions.updateOne(
            { question: req.question },
            {
              $set: {
                status: "solved",
              },
            }
          );
          const item = await Subscribe.findOne({ question: req.question });
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
          });
          io.to(socket.id).emit("update", { status: "true" });
          io.sockets.emit("updated");
        }
      }
    } catch {
      io.to(socket.id).emit("update", { status: "false" });
    }
  });

  socket.on("subscribe", async (req) => {
    try {
      const logged = await auth(req.email, req.pass, socket.id, "subscribe");
      if (logged) {
        const item = await Subscribe.findOne({ question: req.question });
        await Subscribe.updateOne(
          { question: req.question },
          {
            $set: {
              email: [...item.email, req.email],
            },
          }
        );
        io.to(socket.id).emit("subscribe", { status: "true" });
      }
    } catch {
      io.to(socket.id).emit("subscribe", { status: "false" });
    }
  });

  socket.on("wrong", async (req) => {
    try {
      const logged = await auth(req.email, req.pass, socket.id, "wrong");
      if (logged) {
        await transporter.sendMail({
          from: "gcekcse2020@gmail.com",
          to: "gcekcse2020@gmail.com",
          subject: "Answer Is Wrong",
          text: req.question + "\n" + req.email,
        });
        io.to(socket.id).emit("wrong", { status: "true" });
      }
    } catch {
      io.to(socket.id).emit("wrong", { status: "false" });
    }
  });

  socket.on("delete", async (req, res) => {
    try {
      const logged = await auth(req.email, req.pass, socket.id, "delete");
      if (logged) {
        await Questions.deleteOne({ question: req.question });
        await Subscribe.deleteOne({ question: req.question });
        await Details.deleteOne({ question: req.question });
        io.to(socket.id).emit("delete", { status: "true" });
        io.sockets.emit("updated");
      }
    } catch {
      io.to(socket.id).emit("delete", { status: "false" });
    }
  });

  socket.on("delete_answer", async (req) => {
    try {
      const logged = await auth(
        req.email,
        req.pass,
        socket.id,
        "delete_answer"
      );
      if (logged) {
        await Details.updateOne(
          { question: req.question },
          {
            $set: {
              answer: "",
              atime: "",
              aemail: "",
            },
          }
        );
        await Questions.updateOne(
          { question: req.question },
          {
            $set: {
              status: "unsolved",
            },
          }
        );
        io.to(socket.id).emit("delete_answer", { status: "true" });
        io.sockets.emit("updated");
      }
    } catch {
      io.to(socket.id).emit("delete_answer", { status: "false" });
    }
  });

  socket.on("add_comment", async (req) => {
    try {
      const logged = await auth(req.email, req.pass, socket.id, "add_comment");
      if (logged) {
        const item = await Details.findOne({ question: req.question });
        if (item.comments.includes(req.comment)) {
          io.to(socket.id).emit("add_comment", { status: "check" });
        } else {
          await Details.updateOne(
            { question: req.question },
            {
              $set: {
                comments: [req.comment, ...item.comments],
              },
            }
          );
          io.to(socket.id).emit("add_comment", { status: "true" });
          io.sockets.emit("comments_updated");
        }
      }
    } catch {
      io.to(socket.id).emit("add_comment", { status: "false" });
    }
  });
});
