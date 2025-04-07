import React, { useEffect, useState } from "react";
import loginImage from "../assets/login.jpg";
import { IoMenu } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { FaUserGraduate } from "react-icons/fa6";
import { MdOutlinePersonAdd } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { BsFillDoorOpenFill } from "react-icons/bs";
import { RiDashboardFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Button, Divider } from "@mui/material";
import useStore from "../store/index";
import LogoutModal from "../components/LogoutModal";
import SignupModal from "../components/SignupModal"; // Import SignupModal
import AddCandidateModal from "../components/AddCandidateModal";
import { toast } from "react-toastify";
import axios from "axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { axiosInstance } from "../store/index";

const API_BASE_URL =`${import.meta.env.VITE_APP_BASE_URL}/api`;
const adminToken = localStorage.getItem("adminToken");



const AdminNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false); // Signup modal state
  const navigate = useNavigate();
  const [admin, setAdmin] = useState("");
  const { adminLogout } = useStore();
  const { fetchCandidates } = useStore();
  const [candiateModalOpen, setcandiateModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleLogout = () => {
    adminLogout();
    navigate("/");
  };

  const showWinner = async () => {
    try {
      await axiosInstance.post(`${API_BASE_URL}/election/toggle-winners`, {
        show: true,
      }, {
        isAdmin: true,
      });
      toast.success("Winner Published Successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const hideWinner = async () => {
    try {
      await axiosInstance.post(`${API_BASE_URL}/election/toggle-winners`, {
        show: false,
      }, {
        isAdmin: true,
      });
      toast.success("Winner Hide Successfully");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const adminID = localStorage.getItem("admin");
    setAdmin(adminID);
  }, []);

  return (
    <>
      {/* Navbar */}
      <div className="w-full p-3 px-10 bg-[#fff] flex justify-between items-center shadow">
        <div>
          <IoMenu
            className="text-3xl text-[#41122e] cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          />
        </div>
        <div className="flex items-center gap-x-5 flex-row-reverse">
          <img
            src={loginImage}
            alt=""
            className="w-[50px] h-[50px] rounded-[50%] cursor-pointer"
            style={{ border: "1px solid #41122e" }}
          />
          <p>{admin}</p>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`shadow fixed top-0 left-0 h-full w-[300px] bg-[#fff] z-[1000] text-white transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ border: "1px solid #41122e" }}
      >
        <div className="p-5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#41122e]">Admin Dashboard</h2>
          <AiOutlineClose
            className="text-2xl text-[#41122e] cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
        <ul className="p-5 space-y-4">
          <li
            className="cursor-pointer text-[#41122e] hover:text-[#6d3b59] flex items-center gap-x-2"
            onClick={() => {
              setIsSidebarOpen(false);
              navigate("/admin");
            }}
          >
            <RiDashboardFill />
            Dashboard
          </li>
          <li
            className="cursor-pointer text-[#41122e] hover:text-[#6d3b59] flex items-center gap-x-2"
            onClick={() => {
              setcandiateModalOpen(true);
              setIsSidebarOpen(false);
            }}
          >
            <MdOutlinePersonAdd /> Add Candidates
          </li>

          <li className="text-[#41122e] hover:text-[#6d3b59]">
            <div
              className="cursor-pointer flex items-center justify-between pr-2"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex items-center gap-x-2">
                <FaUserGraduate />
                Voters
              </div>
              <div>
                {isDropdownOpen ? (
                  <FaChevronUp className="text-sm" />
                ) : (
                  <FaChevronDown className="text-sm" />
                )}
              </div>
            </div>

            {isDropdownOpen && (
              <ul className="ml-6 mt-2 space-y-1 text-sm text-[#41122e]">
                <li
                  className="cursor-pointer hover:text-[gray] text-[15px] py-1 flex items-center gap-x-2"
                  onClick={() => {
                    setIsSignupModalOpen(true);
                    setIsSidebarOpen(false);
                  }}
                >
                  <FaRegCircle />
                  Add Voter
                </li>
                <Divider />
                <li
                  className="cursor-pointer hover:text-[gray] text-[15px] py-1 flex items-center gap-x-2"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    navigate("/admin/voter-list");
                  }}
                >
                  <FaRegCircle />
                  Voter List
                </li>
                <Divider />
                <li
                  className="cursor-pointer hover:text-[gray] text-[15px] py-1 flex items-center gap-x-2"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    navigate("/admin/votes");
                  }}
                >
                  <FaRegCircle />
                  Voting Details
                </li>
              </ul>
            )}
          </li>

          <li className="cursor-pointer text-[#41122e] hover:text-[#6d3b59] flex items-center gap-x-2">
            <SiGoogleclassroom />
            Add Departments
          </li>
          <li className="cursor-pointer text-[#41122e] hover:text-[#6d3b59] flex items-center gap-x-2">
            <BsFillDoorOpenFill />
            Add Branches
          </li>
        </ul>
        <div className="w-full px-5">
          <Button
            variant="contained"
            sx={{ background: "#41122e" }}
            onClick={() => {
              setIsLogoutModalOpen(true);
              setIsSidebarOpen(false);
            }}
          >
            Logout
          </Button>
        </div>

        <div className="flex w-full p-5 gap-x-2 items-center">
          <Button
            variant="contained"
            sx={{ background: "#41122e", fontSize: "12px" }}
            onClick={showWinner}
          >
            Show winner
          </Button>

          <Button
            variant="contained"
            sx={{ background: "#41122e", fontSize: "12px" }}
            onClick={hideWinner}
          >
            Hide winner
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Modals */}
      <LogoutModal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
      <SignupModal
        open={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />

      <AddCandidateModal
        open={candiateModalOpen}
        handleClose={() => setcandiateModalOpen(false)}
        onCandidateAdded={fetchCandidates}
      />
    </>
  );
};

export default AdminNavbar;
