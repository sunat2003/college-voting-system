const express = require("express");
const { vote,getVotes,deleteVote } = require("../controllers/voteController");
const verifyAdmin=require('../middlewares/verifyAdminToken');
const verifyUser=require('../middlewares/verifyUserToken');

const router = express.Router();
router.post("/vote",verifyUser, vote);
router.get("/vote",verifyAdmin, getVotes);
router.delete("/vote/:id",verifyAdmin,deleteVote);


module.exports = router;
