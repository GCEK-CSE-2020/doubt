const mongoose = require("mongoose");

const notes = (user) => {
  const noteSchema = new mongoose.Schema(
    {
      note: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );

  return mongoose.model(user, noteSchema);
};

module.exports = notes;
