import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FaUserLarge } from "react-icons/fa6";
import { GrSelection } from "react-icons/gr";
import { BsDoorOpenFill } from "react-icons/bs";
import { toast } from "react-toastify";
const API_BASE_URL =`${import.meta.env.VITE_APP_BASE_URL}/api`;
const adminToken = localStorage.getItem("adminToken");
import { axiosInstance } from "../store";



const validationSchema = z.object({
  name:  z
  .string()
  .nonempty("Candidate  name is required")
  .min(3, "Candidate name must be at least 3 characters long")
  .refine(val => !/^\d+$/.test(val), {
    message: "Candidate name cannot be only numbers",
  }),
  party:  z
  .string()
  .nonempty("Party is required")
  .min(3, "Party name must be at least 3 characters long")
  .refine(val => !/^\d+$/.test(val), {
    message: "Party cannot be only numbers",
  }),
  department:  z
  .string()
  .nonempty("Department  name is required")
  .min(3, "Department name must be at least 3 characters long")
  .refine(val => !/^\d+$/.test(val), {
    message: "Department name cannot be only numbers",
  }),
  position: z.string().nonempty("Position is required."),
  image: z.any().optional(), // optional for updates
});

const UpdateCandidateModal = ({
  open,
  handleClose,
  candidateData,
  onUpdated,
}) => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: "",
      party: "",
      department: "",
      position: "",
      image: null,
    },
  });

  const watchedImage = watch("image");

  useEffect(() => {
    if (candidateData) {
      setValue("name", candidateData.name);
      setValue("party", candidateData.party);
      setValue("department", candidateData.department);
      setValue("position", candidateData.position);
      setValue("image", candidateData.image); // For preview
    }
  }, [candidateData, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("image", file);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", data.name);
    formDataToSend.append("party", data.party);
    formDataToSend.append("department", data.department);
    formDataToSend.append("position", data.position);
    if (data.image && typeof data.image !== "string") {
      formDataToSend.append("image", data.image);
    }

    try {
      await axiosInstance.put(
        `${API_BASE_URL}/candidates/${candidateData._id}`,
        formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          isAdmin: true
        }
      );
      toast.success("Candidate update successfully");
      onUpdated(); // Refresh candidate list
      reset();
      handleClose();
    } catch (error) {
      console.error("Error updating candidate:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="update-candidate-modal"
    >
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
          Update Candidate
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="flex items-center gap-x-2.5">
            <FaUserLarge className="text-[#41122e]" />
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={{ mb: 2 }}
                  variant="standard"
                />
              )}
            />
          </div>

          {/* Party */}
          <div className="flex items-center gap-x-2.5">
            <GrSelection className="text-[#41122e]" />
            <Controller
              name="party"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Party"
                  error={!!errors.party}
                  helperText={errors.party?.message}
                  sx={{ mb: 2 }}
                  variant="standard"
                />
              )}
            />
          </div>

          {/* Department */}
          <div className="flex items-center gap-x-2.5">
            <BsDoorOpenFill className="text-[#41122e]" />
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Department"
                  error={!!errors.department}
                  helperText={errors.department?.message}
                  sx={{ mb: 2 }}
                  variant="standard"
                />
              )}
            />
          </div>

          {/* Position */}
          <div className="flex items-center gap-x-2.5">
            <GrSelection className="text-[#41122e]" />
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Position"
                  error={!!errors.position}
                  helperText={errors.position?.message}
                  sx={{ mb: 2 }}
                  variant="standard"
                >
                  <MenuItem value="President">President</MenuItem>
                  <MenuItem value="Vice President">Vice President</MenuItem>
                  <MenuItem value="General Secretary">
                    General Secretary
                  </MenuItem>
                  <MenuItem value="Joint Secretary">Joint Secretary</MenuItem>
                  <MenuItem value="Treasurer">Treasurer</MenuItem>
                </TextField>
              )}
            />
          </div>

          {/* Image Preview */}
          {/* Image Preview */}
          {candidateData?.image && typeof candidateData.image === "string" && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Current Image:
              </Typography>
              <img
                src={candidateData?.image}
                alt="Current"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            </Box>
          )}

          {/* File Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={errors.image ? "error-input" : ""}
          />

          {errors.image && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.image.message}
            </Typography>
          )}

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, bgcolor: "#41122e" }}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Candidate"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default UpdateCandidateModal;
