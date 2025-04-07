const express = require("express");
const router = express.Router();
const { setShowWinners, getShowWinnersStatus } = require("../controllers/electionController");
const verifyAdmin=require('../middlewares/verifyAdminToken');
const verifyUser=require('../middlewares/verifyUserToken');

router.post("/toggle-winners",verifyAdmin, setShowWinners);       // Admin only
router.get("/status",verifyUser, getShowWinnersStatus);          // Used by frontend to check

module.exports = router;
