const express = require("express");
const router = express.Router();
const VotingStatus = require("../models/VotingStatus");

// Get current status
router.get("/", async (req, res) => {
  let status = await VotingStatus.findOne();
  if (!status) {
    status = await VotingStatus.create({ isActive: false });
  }
  res.json(status);
});

// Update status (Start/Stop)
router.post("/", async (req, res) => {
  const { isActive } = req.body;
  let status = await VotingStatus.findOne();

  if (!status) {
    status = await VotingStatus.create({ isActive });
  } else {
    status.isActive = isActive;
    await status.save();
  }

  res.json(status);
});

module.exports = router;
