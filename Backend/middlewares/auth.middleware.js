const User = require("../models/user.model");
const TokenBlacklist = require("../models/token-blacklist.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function authUser(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied! No token provided." });
  }

  const blacklistedToken = await TokenBlacklist.findOne({ token });
  if (blacklistedToken) {
    return res
      .status(401)
      .json({ error: "Unauthorized! Token has been blacklisted." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized! Invalid token." });
  }
}

module.exports = {
  authUser,
};
