const express = require("express");
const note = require("../../models/note");
const auth = require("../../middleware/auth");

const router = new express.Router();

router.get("/notes", auth, async (req, res) => {
  const Note = note(req.user.user);

  try {
    const notes = await Note.find({});

    res.send(notes);
  } catch {
    res.status(400).send({ status: "false" });
  }
});

router.post("/notes", auth, async (req, res) => {
  const Note = note(req.user.user);

  const note = new Note(req.body);

  try {
    await note.save();

    res.send(notes);
  } catch {
    res.status(400).send({ status: "false" });
  }
});

// router.patch("/notes", auth, async (req, res) => {
//   const Note = note(req.user.user);

//   try {
//     await note.save();

//     res.send(notes);
//   } catch {
//     res.status(400).send({ status: "false" });
//   }
// });

module.exports = router;
