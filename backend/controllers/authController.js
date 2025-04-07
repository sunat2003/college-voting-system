const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateVoterId = () => {
  return `PCTE2025${Math.floor(10000 + Math.random() * 90000)}`;
};

exports.signup = async (req, res) => {
  try {
    const { username, rollNumber, department, branch, gender, password } = req.body;

    // Check if roll number already exists
    const existingUser = await User.findOne({ rollNumber });
    if (existingUser) {
      return res.status(400).json({ message: "Roll number already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique Voter ID
    let voterId;
    let isUnique = false;

    while (!isUnique) {
      voterId = generateVoterId();
      const existingVoter = await User.findOne({ voterId });
      if (!existingVoter) isUnique = true;
    }

    // Create user
    const newUser = new User({
      username,
      rollNumber,
      department,
      branch,
      gender,
      password: hashedPassword,
      voterId,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", voterId });
  } catch (error) {
    res.status(500).json({ message: "Error in signup", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { voterId, password } = req.body;
    const user = await User.findOne({ voterId });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_USER_SECRET, { expiresIn: "1d" });
    res.json({ 
      message: "Login successful", 
      token, 
      user: { 
        username: user.username, 
        rollNumber: user.rollNumber, 
        department: user.department, 
        branch: user.branch, 
        voterId: user.voterId 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: "Error in login", error });
  }
};


// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("-password")
      .populate("department", "name")
      .populate("branch", "name");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error });
  }
};


// Update user by ID
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error });
  }
};

