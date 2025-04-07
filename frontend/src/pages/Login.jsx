import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useStore from "../store/index";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import loginImage from "../assets/signup.jpg";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import LoginAnimations from '../components/lottie/LoginAnimations';

// Zod Schema
const loginSchema = z.object({
  role: z.string().min(1, "Role is required"),
  voterId: z
    .string()
    .min(6, "Voter ID/Admin ID must be at least 6 characters")
    .max(15, "Voter ID/Admin ID cannot exceed 15 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot exceed 20 characters"),
});

const Login = () => {
  const { login, adminLogin } = useStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: "", // important fix
      voterId: "",
      password: "",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    try {
      if (data.role === "admin") {
        await adminLogin({ adminID: data.voterId, password: data.password });
        navigate("/admin");
      } else {
        await login({ voterId: data.voterId, password: data.password });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="w-screen flex md:flex-row flex-col md:h-screen h-auto">
      <div className="md:w-1/2 w-full h-full flex justify-center items-center">
        {/* <img
          src={loginImage}
          alt="loading"
          className="md:h-2/4 md:w-2/4 w-[100px] h-[100px]"
        /> */}

        <LoginAnimations/>
      </div>
      <div className="md:w-1/2 w-full h-full flex flex-col justify-center items-center pb-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-3/4 md:p-10 p-10 rounded-[5px] shadow-2xl"
          style={{ outline: "1px solid #41122e" }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: "#41122e" }}
          >
            Login
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div className="flex items-end gap-x-2.5">
              <div className="h-full pb-4">
                <RiAdminLine className="text-lg text-[#41122e]" />
              </div>
              <TextField
                select
                fullWidth
                label="Select Role"
                {...register("role")}
                error={!!errors.role}
                helperText={errors.role?.message}
                margin="normal"
                variant="standard"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="voter">Voter</MenuItem>
              </TextField>
            </div>

            <div className="flex items-end gap-x-2.5">
              <div className="h-full pb-4">
                <FaUserAlt className="text-md text-[#41122e]" />
              </div>
              <TextField
                fullWidth
                label="Voter ID/Admin ID"
                {...register("voterId")}
                error={!!errors.voterId}
                helperText={errors.voterId?.message}
                margin="normal"
                variant="standard"
              />
            </div>

            <div className="flex items-end gap-x-2.5">
              <div className="h-full pb-4">
                <RiLockPasswordFill className="text-xl text-[#41122e]" />
              </div>
              <TextField
                fullWidth
                label="Password"
                type="password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                margin="normal"
                variant="standard"
              />
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ background: "#41122e", mb: 2, mt: 2 }}
            >
              Login
            </Button>
          </Box>
        </form>
      </div>
    </div>
  );
};

export default Login;
