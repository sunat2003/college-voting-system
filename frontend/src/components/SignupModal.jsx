import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useStore from "../store/index";
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  Modal,
} from "@mui/material";
import signupImage from "../assets/signup.jpg";
import { FaUserAlt } from "react-icons/fa";
import { IoBarChartOutline, IoTransgender } from "react-icons/io5";
import { SiGoogleclassroom } from "react-icons/si";
import { BsDoorOpenFill } from "react-icons/bs";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdContentCopy } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import LottieAnimation from "./LottieAnimation";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20),
  rollNumber: z.string().min(1, "Roll Number is required"),
  department: z.string().min(1, "Department is required"),
  branch: z.string().min(1, "Branch is required"),
  gender: z.string().min(1, "Gender is required"),
  password: z.string().min(6, "Password must be at least 6 characters").max(20),
});

const SignupModal = ({ open, onClose }) => {
  const { departments, branches, fetchDepartments, fetchBranchs, signup } = useStore();
  const navigate = useNavigate();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [voterId, setVoterId] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const selectedDepartment = watch("department");

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) fetchBranchs(selectedDepartment);
  }, [selectedDepartment]);

  const onSubmit = async (data) => {
    try {
      await signup(data);
      const storedVoterId = localStorage.getItem("voterId");
      if (storedVoterId) {
        setVoterId(storedVoterId);
        setSuccessModalOpen(true);
      }
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(voterId);
  };

  return (
    <>
      {/* Signup Modal */}
      <Modal open={open} onClose={onClose}>
        <Box className="relative h-[90%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-9/10 bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl"
          >
            <AiOutlineClose />
          </button>

          <img
            src={signupImage}
            alt="Signup"
            className="md:w-1/2 w-1/3 md:h-[100%] h-[10%] md:block"
          />
          <Box className="w-full md:w-1/2 p-4">
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ color: "#41122e" }}
            >
              Voter Signup
            </Typography>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <Box sx={{ display: "flex", flexDirection: "column" }} className="gap-y-5">
                <div className="flex items-end gap-x-3">
                  <FaUserAlt className="text-md text-[#41122e]" />
                  <TextField
                    label="Username"
                    {...register("username")}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    fullWidth
                    variant="standard"
                  />
                </div>
                <div className="flex items-end gap-x-2.5">
                  <IoBarChartOutline className="text-md text-[#41122e]" />
                  <TextField
                    label="Roll Number"
                    {...register("rollNumber")}
                    error={!!errors.rollNumber}
                    helperText={errors.rollNumber?.message}
                    fullWidth
                    variant="standard"
                  />
                </div>
                <div className="flex items-end gap-x-2.5">
                  <SiGoogleclassroom className="text-xl text-[#41122e]" />
                  <TextField
                    select
                    label="Department"
                    {...register("department")}
                    error={!!errors.department}
                    helperText={errors.department?.message}
                    fullWidth
                    variant="standard"
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="flex items-end gap-x-2.5">
                  <BsDoorOpenFill className="text-xl text-[#41122e]" />
                  <TextField
                    select
                    label="Branch"
                    {...register("branch")}
                    error={!!errors.branch}
                    helperText={errors.branch?.message}
                    fullWidth
                    variant="standard"
                  >
                    {branches.map((branch) => (
                      <MenuItem key={branch._id} value={branch._id}>
                        {branch.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="flex items-end gap-x-2.5">
                  <IoTransgender className="text-xl text-[#41122e]" />
                  <TextField
                    select
                    label="Gender"
                    {...register("gender")}
                    error={!!errors.gender}
                    helperText={errors.gender?.message}
                    fullWidth
                    variant="standard"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </div>
                <div className="flex items-end gap-x-2.5">
                  <RiLockPasswordFill className="text-xl text-[#41122e]" />
                  <TextField
                    label="Password"
                    type="password"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    fullWidth
                    variant="standard"
                  />
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ background: "#41122e" }}
                >
                  Sign Up
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>

      {/* Success Modal */}
      <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <Box className="relative w-[350px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg text-center">
          {/* Close Button */}
          <button
            onClick={() => setSuccessModalOpen(false)}
            className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl"
          >
            <AiOutlineClose />
          </button>

          <Typography variant="h5" gutterBottom sx={{ color: "#41122e" }}>
            Voter ID Generated Successfully
          </Typography>
          <div className="w-full flex justify-center">
            <LottieAnimation />
          </div>
          <Typography
            variant="body1"
            sx={{ fontWeight: "bold", color: "#333" }}
          >
            {voterId}
          </Typography>
          <Button
            onClick={handleCopy}
            variant="contained"
            sx={{ background: "#41122e", mt: 2 }}
          >
            <MdContentCopy className="mr-2" /> Copy Voter ID
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default SignupModal;
