const mongoose = require("mongoose");

const electionStatusSchema = new mongoose.Schema({
  showWinners: { type: Boolean, default: false }
});

module.exports = mongoose.model("ElectionStatus", electionStatusSchema);
