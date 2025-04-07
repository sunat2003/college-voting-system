const express = require("express");
const {
  addCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  getCandidatesByPosition ,
  getWinnersByPosition,
  getPublicCandidates,
  getPublicCandidatesByPosition
} = require("../controllers/candidateController");
const upload = require("../middlewares/upload"); // Middleware for handling image uploads
const verifyAdmin=require('../middlewares/verifyAdminToken');
const verifyUser=require('../middlewares/verifyUserToken');


const router = express.Router();

// Create a new candidate (POST)   (admin)
router.post("/add-candidate", upload.single("image"),verifyAdmin, addCandidate);

// Get all candidates (GET) (admin)
router.get("/",verifyAdmin, getCandidates);


// Get all candidates (GET)(user)
router.get("/public",verifyUser,getPublicCandidates);

// ✅ Get candidates by position (e.g. /public/President)(user)
router.get("/public/:position",verifyUser, getPublicCandidatesByPosition);


// ✅ Get candidates by position (e.g. /position/President)(admin)
router.get("/position/:position",verifyAdmin, getCandidatesByPosition);


// Get a single candidate by ID (GET)
router.get("/:id", getCandidateById);

// Update a candidate (PUT)
router.put("/:id", upload.single("image"),verifyAdmin, updateCandidate);

// Delete a candidate (DELETE)
router.delete("/delete/:id",verifyAdmin, deleteCandidate);

//get winner each candidate wise
router.get("/winners/position", getWinnersByPosition);


module.exports = router;
