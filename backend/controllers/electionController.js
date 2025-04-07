const ElectionStatus = require("../models/ElectionStatus");

// Toggle showWinners
exports.setShowWinners = async (req, res) => {
  try {
    const { show } = req.body;

    let status = await ElectionStatus.findOne();
    if (!status) {
      status = new ElectionStatus({ showWinners: show });
    } else {
      status.showWinners = show;
    }

    await status.save();
    res.json({ message: "Winner visibility updated", showWinners: show });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
};

// Get current winner status
exports.getShowWinnersStatus = async (req, res) => {
  try {
    const status = await ElectionStatus.findOne();
    res.json({ showWinners: status?.showWinners || false });
  } catch (error) {
    res.status(500).json({ message: "Error fetching status", error });
  }
};
