const jwt = require("jsonwebtoken");
const User = require("../../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "madeByRamnath");
    const user = await User.findOne({
      email: decoded.email,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;

    next();
  } catch {
    res.status(401).send({ status: false });
  }
};

module.exports = auth;
