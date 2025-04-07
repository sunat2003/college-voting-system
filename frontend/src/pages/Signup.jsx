import React, { useEffect } from "react";
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
  Link,
} from "@mui/material";
import signupImage from "../assets/signup.jpg";
import { FaUserAlt } from "react-icons/fa";
import { IoBarChartOutline } from "react-icons/io5";
import { SiGoogleclassroom } from "react-icons/si";
import { BsDoorOpenFill } from "react-icons/bs";
import { IoTransgender } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters"),
  rollNumber: z.string().min(1, "Roll Number is required"),
  department: z.string().min(1, "Department is required"),
  branch: z.string().min(1, "Branch is required"),
  gender: z.string().min(1, "Gender is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot exceed 20 characters"),
});

const Signup = () => {
  const { departments, branches, fetchDepartments, fetchBranchs, signup } =
    useStore();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const selectedDepartment = watch("department");

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetchBranchs(selectedDepartment);
    }
  }, [selectedDepartment]);

  const onSubmit = async (data) => {
    try {
      await signup(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-screen flex md:flex-row flex-col md:h-screen h-auto">
      <div className="md:w-1/2 w-full h-full flex justify-center items-center">
        <img src={signupImage} alt="loading" className="md:h-2/3 md:w-2/3 w-[100px] h-[100px]"/>
      </div>
      <div className="md:w-1/2 w-full h-full flex flex-col justify-center items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-3/4 md:p-10 p-5 rounded-[5px] shadow-2xl"
          style={{ outline: "1px solid #41122e" }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: "#41122e" }}
          >
            Voter Signup
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div className="flex items-end gap-x-2.5">
              <div className="h-full pb-2">
                <FaUserAlt className="text-md text-[#41122e]" />
              </div>
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
              <div className="h-full pb-2">
                <IoBarChartOutline className="text-md text-[#41122e]" />
              </div>
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
              <div className="h-full pb-2">
                <SiGoogleclassroom className="text-xl text-[#41122e]" />
              </div>
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
              <div className="h-full pb-2">
                <BsDoorOpenFill className="text-xl text-[#41122e]" />
              </div>
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
              <div className="h-full pb-2">
                <IoTransgender className="text-xl text-[#41122e]" />
              </div>
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
              <div className="h-full pb-2">
                <RiLockPasswordFill className="text-xl text-[#41122e]" />
              </div>
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
              sx={{ background: "#41122e"}}
            >
              Sign Up
            </Button>

            <div className="w-full px-5 flex justify-center">
              <p className="text-[#726f6f]">
                I already have an account.{" "}
                <Link
                  onClick={() => {
                    navigate("/");
                  }}
                  sx={{
                    color: "#41122e",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  Login
                </Link>
              </p>
            </div>
          </Box>
        </form>
      </div>
    </div>
  );
};

export default Signup;
