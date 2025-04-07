import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  TextField,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { GrSelection } from "react-icons/gr";
import { BiListUl } from "react-icons/bi";
import axios from "axios";
import {toast} from "react-toastify";

const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api`;

const BranchListModal = ({ open, onClose }) => {
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [branches, setBranches] = useState([]);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/departments`);
      setDepartments(res.data.departments);
    } catch (err) {
      console.error("Fetch departments failed:", err);
    }
  };

  const fetchBranches = async (deptId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/departments/branches/${deptId}`);
      setBranches(res.data.branches);
    } catch (err) {
      console.error("Fetch branches failed:", err);
    }
  };

  const deleteBranch = async (branchId) => {
    try {
      await axios.delete(`${API_BASE_URL}/departments/branches/${branchId}`);
      setBranches((prev) => prev.filter((b) => b._id !== branchId));
      toast.success("Branch Deleted Successfully")
    } catch (err) {
      console.error("Delete branch failed:", err);
    }
  };

  useEffect(() => {
    if (open) fetchDepartments();
  }, [open]);

  useEffect(() => {
    if (selectedDeptId) fetchBranches(selectedDeptId);
    else setBranches([]);
  }, [selectedDeptId]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="md:w-[600px] w-[350px]"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: "#41122e" }}>
          Branches by Department
        </Typography>

        <div className="flex items-center gap-x-2.5">
          <GrSelection className="text-[#41122e]" />
          <TextField
            select
            label="Select Department"
            fullWidth
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            variant="standard"
            sx={{ mb: 2 }}
          >
            {departments.map((dept) => (
              <MenuItem key={dept._id} value={dept._id}>
                {dept.name}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div className="flex items-center gap-x-2.5 mb-2 mt-4">
          <BiListUl className="text-[#41122e]" />
          <Typography variant="subtitle1" sx={{ color: "#41122e" }}>
            Branch List
          </Typography>
        </div>

        <List>
          {branches.map((branch) => (
            <React.Fragment key={branch._id}>
              <ListItem>
                <ListItemText primary={branch.name} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => deleteBranch(branch._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
          {branches.length === 0 && selectedDeptId && (
            <Typography sx={{ mt: 2 }}>No branches found under this department.</Typography>
          )}
        </List>
      </Box>
    </Modal>
  );
};

export default BranchListModal;
