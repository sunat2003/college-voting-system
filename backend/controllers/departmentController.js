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


// DELETE department by ID
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: Delete all branches under the department
    await Branch.deleteMany({ department: id });

    const deleted = await Department.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting department", error });
  }
};

// DELETE branch by ID
exports.deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Branch.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json({ message: "Branch deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting branch", error });
  }
};

