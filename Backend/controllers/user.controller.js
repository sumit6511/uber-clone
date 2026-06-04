const User = require("../models/user.model");
const userService = require("../services/user.service");

const { validationResult } = require("express-validator");

async function registerUser(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;

  try {
    const user = await userService.createUser({
      firstName: fullName.firstName,
      lastName: fullName.lastName,
      email,
      password,
    });
    const token = user.generateAuthToken();
    res.status(201).json({
      msg: "User Registered Successfully!",
      user,
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function loginUser(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password!" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password!" });
  }

  const token = user.generateAuthToken();

  res.cookie("token", token);

  res.json({
    msg: "Login Successful!",
    user,
    token,
  });
}

module.exports = {
  registerUser,
  loginUser,
  // getUserProfile,
};
