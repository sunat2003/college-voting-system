const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  party: { type: String, required: true },
  department: { type: String, required: true },
  position: {
    type: String,
    enum: ["President", "Vice President", "General Secretary", "Joint Secretary", "Treasurer"],
    required: true
  },
  voteCount: { type: Number, default: 0 },
  image: { type: String } // Stores image file path
});

module.exports = mongoose.model("Candidate", candidateSchema);
