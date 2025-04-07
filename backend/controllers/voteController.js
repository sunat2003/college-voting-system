const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");
const User = require("../models/User");

exports.vote = async (req, res) => {
  try {
    const { voterId, candidateId } = req.body;

    // Find user by voterId
    const user = await User.findOne({ voterId });
    if (!user) return res.status(400).json({ message: "Invalid Voter ID" });

    // Find candidate and get their position
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    const position = candidate.position;

    // Check if user has already voted for this position
    const existingVote = await Vote.findOne({ userId: user._id, position });
    if (existingVote) {
      return res.status(400).json({ message: `You have already voted for the position of ${position}` });
    }

    // Create vote and update candidate vote count
    await new Vote({
      userId: user._id,
      candidateId,
      position
    }).save();

    candidate.voteCount += 1;
    await candidate.save();

    res.status(200).json({ message: `Vote for ${position} cast successfully!`, candidate });
  } catch (error) {
    res.status(500).json({ message: "Error casting vote", error });
  }
};


exports.getVotes = async (req, res) => {
  try {
    const votes = await Vote.find()
      .populate("userId", "voterId username")
      .populate("candidateId", "name party position");

    res.status(200).json({ count: votes.length, votes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching votes", error });
  }
};


exports.deleteVote = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVote = await Vote.findByIdAndDelete(id);
    if (!deletedVote) {
      return res.status(404).json({ message: "Vote not found" });
    }

    res.status(200).json({ message: "Vote deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting vote", error });
  }
};