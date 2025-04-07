const express = require("express");
const { addDepartment, addBranch, getDepartments, getBranchesByDepartment,deleteDepartment ,deleteBranch} = require("../controllers/departmentController");
const router = express.Router();

router.post("/add-department", addDepartment);
router.post("/add-branch", addBranch);
router.delete("/:id",deleteDepartment); // ⬅️ Add this

router.get("/", getDepartments);
router.get("/branches/:departmentId", getBranchesByDepartment);
router.delete("/branches/:id",deleteBranch); // ⬅️ Add this


module.exports = router;
