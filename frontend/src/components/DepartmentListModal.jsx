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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { BiListUl } from "react-icons/bi";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api`;

const DepartmentListModal = ({ open, onClose }) => {
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/departments`);
      setDepartments(res.data?.departments);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/departments/${id}`);
      setDepartments((prev) => prev.filter((dept) => dept._id !== id));
      toast.success("Department deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    if (open) fetchDepartments();
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="md:w-[500px] w-[350px]"
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
        <div className="flex items-center gap-x-2.5 mb-4">
          <BiListUl className="text-[#41122e]" />
          <Typography variant="h6" sx={{ color: "#41122e" }}>
            All Departments
          </Typography>
        </div>

        <List>
          {departments.map((dept) => (
            <React.Fragment key={dept._id}>
              <ListItem>
                <ListItemText primary={dept.name} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => deleteDepartment(dept._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
          {departments.length === 0 && (
            <Typography sx={{ mt: 2 }}>No departments found.</Typography>
          )}
        </List>
      </Box>
    </Modal>
  );
};

export default DepartmentListModal;
