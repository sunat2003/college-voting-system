import React, { useEffect, useState } from "react";
import { Modal, Box, TextField, Button, Typography, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { BsDoorOpenFill } from "react-icons/bs";
import { GrSelection } from "react-icons/gr";
import {toast} from 'react-toastify';

const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api`;

const schema = z.object({
  name: z
    .string()
    .nonempty("Branch name is required")
    .min(3, "Branch name must be at least 3 characters long")
    .refine(val => !/^\d+$/.test(val), {
      message: "Branch name cannot be only numbers",
    }),
});

const AddBranchModal = ({ open, onClose }) => {
  const [departments, setDepartments] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      departmentId: "",
    },
  });

  useEffect(() => {
    if (open) {
      axios
        .get(`${API_BASE_URL}/departments`)
        .then((res) => setDepartments(res.data?.departments || []))
        .catch((err) => console.error("Failed to fetch departments:", err));
    }
  }, [open]);

  const onSubmit = async (data) => {
    try {
      await axios.post(`${API_BASE_URL}/departments/add-branch`, data);
      toast.success("Branches Added Successfully")
      reset();
      onClose();
    } catch (err) {
      console.error("Error adding branch:", err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
        className="md:w-[600px] w-[350px]"
      >
        <Typography variant="h6" sx={{ mb: 2, color: "#41122e" }}>
          Add Branch
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center gap-x-2.5">
            <BsDoorOpenFill className="text-[#41122e]" />
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Branch Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  variant="standard"
                  sx={{ mb: 2 }}
                />
              )}
            />
          </div>

          <div className="flex items-center gap-x-2.5">
            <GrSelection className="text-[#41122e]" />
            <Controller
              name="departmentId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Select Department"
                  error={!!errors.departmentId}
                  helperText={errors.departmentId?.message}
                  variant="standard"
                  sx={{ mb: 2 }}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, bgcolor: "#41122e" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddBranchModal;
