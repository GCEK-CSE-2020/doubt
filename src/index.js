const express = require("express");
require("./db");
const userRouter = require("./routers/user");
const noteRouter = require("./routers/note");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(userRouter);
app.use(noteRouter);

app.get("/", (req, res) => {
  res.send("welcome to playork sticky notes");
});

app.listen(port, () => {
  console.log("running in port: " + port);
});
