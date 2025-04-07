const express = require("express");
const { addDepartment, addBranch, getDepartments, getBranchesByDepartment } = require("../controllers/departmentController");
const router = express.Router();

router.post("/add-department", addDepartment);
router.post("/add-branch", addBranch);
router.get("/", getDepartments);
router.get("/branches/:departmentId", getBranchesByDepartment);

module.exports = router;
