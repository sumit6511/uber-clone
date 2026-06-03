const User = require("../models/user.model");

async function createUser({ firstName, lastName, email, password }) {
  if (!firstName || !email || !password) {
    throw new Error("All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const hash = await User.hashPassword(password);

  const user = await User.create({
    fullName: { firstName, lastName },
    email,
    password: hash,
  });

  return user;
}

module.exports = {
  createUser,
};
