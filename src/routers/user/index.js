const express = require("express");
const User = require("../../models/user");
const auth = require("../../middleware/auth");
const multer = require("multer");

const upload = multer({
  limits: {
    fileSize: 2097152,
  },
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error());
    }

    callback(undefined, true);
  },
});

const router = new express.Router();

router.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    const token = await user.createToken();

    res.status(201).send({ status: "done", token: token });
  } catch (error) {
    res.status(400).send({ status: "false" });
  }
});

router.post(
  "/user/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    req.user.avatar = req.file.buffer;

    await req.user.save();

    res.send({ status: "done" });
  },
  (error, req, res, next) => {
    res.status(400).send({ status: "false" });
  }
);

router.post("/login", async (req, res) => {
  try {
    const user = await User.findUser(req.body.user, req.body.password);

    const token = await user.createToken();

    const publicUser = await user.publicUser();

    res.send({ user: publicUser, token: token });
  } catch {
    res.status(400).send({ status: "false" });
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.send({ status: "done" });
  } catch {
    res.status(400).send({ status: "false" });
  }
});

router.get("/user", auth, async (req, res) => {
  try {
    const user = await req.user.publicUser();
    res.send(user);
  } catch {
    res.status(400).send({ status: "false" });
  }
});

router.patch("/user", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));

    await req.user.save();

    res.send({ status: "done" });
  } catch (error) {
    res.status(500).send({ status: "false" });
  }
});

router.delete("/user", auth, async (req, res) => {
  try {
    await req.user.remove();

    res.send({ status: "done" });
  } catch (error) {
    res.status(500).send({ status: "false" });
  }
});

module.exports = router;
