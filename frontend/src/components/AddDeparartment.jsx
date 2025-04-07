import React from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { BsDoorOpenFill } from "react-icons/bs";
import {toast} from 'react-toastify';

const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api`;

const validationSchema = z.object({
  name: z.string().nonempty("Department name is required"),
});

const AddDepartmentModal = ({ open, onClose }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = async (data) => {
    try {
      await axios.post(`${API_BASE_URL}/departments/add-department`, data);
      toast.success("Department Added Successfully")
      reset();
      onClose();
    } catch (err) {
      console.error("Error:", err);
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
          Add Department
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
                  label="Department Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  variant="standard"
                  sx={{ mb: 2 }}
                />
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

export default AddDepartmentModal;
