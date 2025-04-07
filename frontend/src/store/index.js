import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api`;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});


axiosInstance.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    const token = localStorage.getItem("token");

    if (config.isAdmin && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (!config.isAdmin && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


const useStore = create((set) => ({
  departments: [],
  branches: [],
  candidates: [],
  publicCandidates: [],
  president: [],
  vicePresident: [],
  generalSecretary: [],
  jointSecretary: [],
  treasurer: [],
  position: [],
  voteStatus: "",
  voters: [],
  voterById: {},

  signup: async (formData) => {
    try {
      const res = await axiosInstance.post("/auth/signup", formData, {
        isAdmin: true,
      });
      localStorage.setItem("voterId", res.data?.voterId);
      toast.success("Signup successful!");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("User already exists");
      } else {
        toast.error("An unexpected error occurred.");
        console.error(error);
      }
    }
  },

  login: async (formData) => {
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      localStorage.setItem("token", res.data?.token);
      localStorage.setItem("userName", res.data?.user?.username);
      localStorage.setItem("voterId", res.data?.user?.voterId);
      toast.success("Voter Login successful!");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Invalid Credentials");
      } else {
        toast.error("An unexpected error occurred.");
        console.error(error);
      }
    }
  },

  adminLogin: async (formData) => {
    try {
      const res = await axiosInstance.post("/admin/login", formData);
      localStorage.setItem("adminToken", res.data?.token);
      localStorage.setItem("admin", res.data?.admin);
      toast.success("Admin Login successful!");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Invalid Credentials");
      } else {
        toast.error("An unexpected error occurred.");
        console.error(error);
      }
    }
  },

  fetchDepartments: async () => {
    try {
      const res = await axiosInstance.get("/departments");
      set({ departments: res.data?.departments });
    } catch (error) {
      console.error(error);
    }
  },

  fetchBranchs: async (departmentId) => {
    try {
      const res = await axiosInstance.get(`/departments/branches/${departmentId}`);
      set({ branches: res.data?.branches });
    } catch (error) {
      console.error(error);
    }
  },

  fetchCandidates: async () => {
    try {
      const res = await axiosInstance.get("/candidates", { isAdmin: true });
      set({ candidates: res.data?.candidates });
    } catch (error) {
      console.error(error);
    }
  },

  fetchPublicCandidates: async () => {
    try {
      const res = await axiosInstance.get("/candidates/public");
      set({ publicCandidates: res.data?.candidates });
    } catch (error) {
      console.error(error);
    }
  },

  fetchCandidatesByPosition: async (position) => {
    try {
      const res = await axiosInstance.get(`/candidates/public/${position}`);
      set({ position: res.data?.candidates });
    } catch (error) {
      console.error(error);
    }
  },

  fetchCandidatesByPresident: async () => {
    try {
      const res = await axiosInstance.get("/candidates/position/President", {
        isAdmin: true,
      });
      set({ president: res.data?.candidates });
    } catch (error) {
      console.error(error);
    }
  },

  fetchCandidatesByVicePresident: async () => {
    try {
      const res = await axiosInstance.get("/candidates/position/Vice President", {
        isAdmin: true,
      });
      set({ vicePresident: res.data?.candidates });
    } catch (error) {
      console.error(error);
    }
  },

  fetchCandidatesByGeneralSecretary: async () => {
    try {
      const res = await axiosInstance.get("/candidates/position/General Secretary", {
        isAdmin: true,
      });
      set({ generalSecretary: res.data?.candidates });
    } catch (error) {
      console.error(error);
    }
  },

  fetchCandidatesByJointSecretary: async () => {
    try {
      const res = await axiosInstance.get("/candidates/position/Joint Secretary", {
        isAdmin: true,
      });
      set({ jointSecretary: res.data?.candidates });
    } catch (error) {
      console.error(error);
    }
  },

  fetchCandidatesByTreasurer: async () => {
    try {
      const res = await axiosInstance.get("/candidates/position/Treasurer", {
        isAdmin: true,
      });
      set({ treasurer: res.data?.candidates });
    } catch (error) {
      console.error(error);
    }
  },

  addCandidates: async (formData) => {
    try {
      await axiosInstance.post("/candidates/add-candidate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        isAdmin: true,
      });
      toast.success("Candidate added successfully");
    } catch (error) {
      toast.error("Error adding candidate");
      console.error(error);
    }
  },

  deleteCandidates: async (id) => {
    try {
      await axiosInstance.delete(`/candidates/delete/${id}`, {
        isAdmin: true,
      });
      toast.success("Candidate deleted successfully");
    } catch (error) {
      toast.error("Error deleting candidate");
      console.error(error);
    }
  },

  castVote: async (data) => {
    try {
      const res = await axiosInstance.post("/votes/vote", data);
      set({ voteStatus: res.statusText });
      toast.success("Vote submitted");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || "Invalid vote");
      } else {
        toast.error("An unexpected error occurred.");
        console.error(error);
      }
    }
  },

  fetchVoters: async () => {
    try {
      const res = await axiosInstance.get("/auth/users", { isAdmin: true });
      set({ voters: res.data });
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  },

  getVotersById: async (id) => {
    try {
      const res = await axiosInstance.get(`/auth/users/${id}`, { isAdmin: true });
      set({ voterById: res.data });
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  },

  deleteVoters: async (id) => {
    try {
      await axiosInstance.delete(`/auth/users/${id}`, { isAdmin: true });
      toast.success("Voter deleted successfully");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  },

  adminLogout: () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    toast.success("Admin logged out");
  },

  userLogout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("voterId");
    toast.success("User logged out");
  },
}));

export default useStore;
