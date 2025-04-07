const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  rollNumber: { type: String, unique: true, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
  password: { type: String, required: true },
  voterId: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("User", userSchema);

