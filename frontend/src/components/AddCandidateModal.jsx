import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import useStore from "../store/index";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaUserLarge } from "react-icons/fa6";
import { GrSelection } from "react-icons/gr";
import { BsDoorOpenFill } from "react-icons/bs";

// Validation Schema using Zod
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
  position: z.string().nonempty({ message: "Position is required." }),
  image: z.any().refine((file) => file !== null, { message: "Image is required." }),
});

const AddCandidateModal = ({ open, handleClose }) => {
  const {
    addCandidates,
    fetchCandidatesByPresident,
    fetchCandidatesByVicePresident,
    fetchCandidatesByGeneralSecretary,
    fetchCandidatesByJointSecretary,
    fetchCandidatesByTreasurer,
  } = useStore();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setValue("image", file); // Update form value for image
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", data.name);
    formDataToSend.append("party", data.party);
    formDataToSend.append("department", data.department);
    formDataToSend.append("position", data.position);
    formDataToSend.append("image", data.image);

    try {
      await addCandidates(formDataToSend);
      fetchCandidatesByPresident();
      fetchCandidatesByVicePresident();
      fetchCandidatesByGeneralSecretary();
      fetchCandidatesByJointSecretary();
      fetchCandidatesByTreasurer();
      reset(); // Reset the form
      handleClose();
    } catch (error) {
      console.error("Error adding candidate:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="add-candidate-modal">
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
          Add Candidate
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                  <MenuItem value="General Secretary">General Secretary</MenuItem>
                  <MenuItem value="Joint Secretary">Joint Secretary</MenuItem>
                  <MenuItem value="Treasurer">Treasurer</MenuItem>
                </TextField>
              )}
            />
          </div>

          {/* File Input */}
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, bgcolor: "#41122e" }}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Candidate"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddCandidateModal;
