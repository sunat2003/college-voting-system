const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  position: { type: String, required: true }
});

// ✅ Ensure a user can only vote once per position
voteSchema.index({ userId: 1, position: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);
