const mongoose = require("mongoose");

const votingStatusSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("VotingStatus", votingStatusSchema);
