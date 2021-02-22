const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://ramnath:f8vzgc891t8au61ckj8gbvk2r11jeh@sticky-notes.7rezg.mongodb.net/sticky-notes?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);
