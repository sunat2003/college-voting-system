const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
require("dotenv").config();

const router = express.Router();

// Admin Signup Route
router.post("/register", async (req, res) => {
  const { adminID, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ adminID });
    if (existingAdmin) return res.status(400).json({ message: "Admin ID already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ adminID, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Admin Login Route
router.post("/login", async (req, res) => {
  const { adminID, password } = req.body;

  try {
    const admin = await Admin.findOne({ adminID });
    if (!admin) return res.status(400).json({ message: "Invalid Admin ID or Password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Admin ID or Password" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_ADMIN_SECRET, { expiresIn: "1h" });

    res.json({ token ,admin:admin.adminID});
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
