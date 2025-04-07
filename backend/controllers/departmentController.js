const Department = require("../models/Department");
const Branch = require("../models/Branch");

exports.addDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const department = new Department({ name });
    await department.save();
    res.status(201).json({ message: "Department added", department });
  } catch (error) {
    res.status(500).json({ message: "Error adding department", error });
  }
};

exports.addBranch = async (req, res) => {
  try {
    const { name, departmentId } = req.body;
    const branch = new Branch({ name, department: departmentId });
    await branch.save();
    res.status(201).json({ message: "Branch added", branch });
  } catch (error) {
    res.status(500).json({ message: "Error adding branch", error });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json({ departments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments", error });
  }
};

exports.getBranchesByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const branches = await Branch.find({ department: departmentId });
    res.json({ branches });
  } catch (error) {
    res.status(500).json({ message: "Error fetching branches", error });
  }
};
