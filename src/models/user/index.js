const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.method("publicUser", async function () {
  const user = this;

  const userObject = user.toObject();

  delete userObject["_id"];
  delete userObject["__v"];
  delete userObject["tokens"];
  delete userObject["password"];

  return userObject;
});

userSchema.method("createToken", async function () {
  const user = this;

  const token = jwt.sign({ email: user.email }, "madeByRamnath");

  user.tokens = user.tokens.concat({ token: token });

  await user.save();

  return token;
});

userSchema.static("findUser", async function (userName, password) {
  const user = await this.findOne({ user: userName });

  if (!user) {
    throw new Error();
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error();
  }

  return user;
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
