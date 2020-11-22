// Model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String, default: "" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
