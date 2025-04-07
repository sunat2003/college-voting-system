const express = require("express");
const { signup, login ,getAllUsers,updateUser,deleteUser,getUserById} = require("../controllers/authController");
const verifyAdminToken = require("../middlewares/verifyAdminToken");


const router = express.Router();

// Auth routes
router.post("/signup",verifyAdminToken, signup);
router.post("/login", login);


router.get("/users",verifyAdminToken,getAllUsers);  
router.get("/users/:id",verifyAdminToken,getUserById);
router.put("/users/:id",updateUser);         // UPDATE user by ID
router.delete("/users/:id",verifyAdminToken,deleteUser);      // DELETE user by ID

module.exports = router;


