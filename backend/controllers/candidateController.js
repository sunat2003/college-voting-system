const Candidate = require("../models/Candidate");

// Create a new candidate (Admin)
exports.addCandidate = async (req, res) => {
  try {
    const { name, party, department, position } = req.body;
    const imageUrl = req.file ? req.file.path : null; // Cloudinary URL

    const candidate = new Candidate({
      name,
      party,
      department,
      position,
      image: imageUrl,
    });

    await candidate.save();

    res.status(201).json({ message: "Candidate added successfully", candidate });
  } catch (error) {
    res.status(500).json({ message: "Error adding candidate", error });
  }
};


// Get all candidates (admin)
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json({ candidates });
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidates", error });
  }
};


// Get all candidates (user)
exports.getPublicCandidates = async (req, res) => {
  try {
    // Exclude 'voteCount' field from the response
    const candidates = await Candidate.find({}, '-voteCount');
    res.json({ candidates });
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidates", error });
  }
};

// Get a single candidate by ID
exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.json({ candidate });
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidate", error });
  }
};

// Update a candidate
exports.updateCandidate = async (req, res) => {
  try {
    const { name, party, department, position } = req.body;
    const imageUrl = req.file ? req.file.path : null; // Cloudinary URL

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.name = name || candidate.name;
    candidate.party = party || candidate.party;
    candidate.department = department || candidate.department;
    candidate.position = position || candidate.position;

    if (imageUrl) {
      candidate.image = imageUrl;
    }

    await candidate.save();
    res.json({ message: "Candidate updated successfully", candidate });
  } catch (error) {
    res.status(500).json({ message: "Error updating candidate", error });
  }
};

// Delete a candidate
exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting candidate", error });
  }
};

// Get candidates by position
exports.getCandidatesByPosition = async (req, res) => {
  try {
    const { position } = req.params;
    const candidates = await Candidate.find({ position });

    if (!candidates.length) {
      return res.status(404).json({ message: "No candidates found for this position" });
    }

    res.json({ candidates });
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidates by position", error });
  }
};

// Get candidates by position
exports.getPublicCandidatesByPosition = async (req, res) => {
  try {
    const { position } = req.params;

    // Exclude `voteCount` using projection
    const candidates = await Candidate.find({ position }, '-voteCount');

    if (!candidates.length) {
      return res.status(404).json({ message: "No candidates found for this position" });
    }

    res.json({ candidates });
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidates by position", error });
  }
};

// Get winners for each position (handling ties)
exports.getWinnersByPosition = async (req, res) => {
  try {
    const positions = [
      "President",
      "Vice President",
      "General Secretary",
      "Joint Secretary",
      "Treasurer"
    ];

    const winners = {};

    for (const position of positions) {
      // Get all candidates for this position
      const candidates = await Candidate.find({ position });

      if (candidates.length === 0) {
        winners[position] = [];
        continue;
      }

      // Find the max vote count
      const maxVotes = Math.max(...candidates.map(c => c.voteCount));

      // Get all candidates who have the max vote count (tie handling)
      const topCandidates = candidates.filter(c => c.voteCount === maxVotes);

      winners[position] = topCandidates;
    }

    res.json({ winners });
  } catch (error) {
    res.status(500).json({ message: "Error fetching winners", error });
  }
};
