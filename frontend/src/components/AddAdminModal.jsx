import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaUserShield } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import axios from "axios";
import {toast} from "react-toastify";

const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api`;


// Validation schema
const validationSchema = z.object({
  adminID: z.string().min(1, { message: "Admin ID is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const AddAdminModal = ({ open, handleClose }) => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      adminID: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/register`, data);
      reset();
      handleClose();
      toast.success("Admin added successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="add-admin-modal">
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
        className="md:w-[400px] w-[320px]"
      >
        <Typography variant="h6" sx={{ mb: 2, color: "#41122e" }}>
          Add Admin
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center gap-x-2.5">
            <FaUserShield className="text-[#41122e]" />
            <Controller
              name="adminID"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Admin ID"
                  fullWidth
                  variant="standard"
                  error={!!errors.adminID}
                  helperText={errors.adminID?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
          </div>

          <div className="flex items-center gap-x-2.5">
            <RiLockPasswordFill className="text-[#41122e]" />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  fullWidth
                  variant="standard"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ bgcolor: "#41122e", mt: 2 }}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Admin"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddAdminModal;
