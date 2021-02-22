const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://ramnath:9037113959rA@cluster0.07lh9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);
