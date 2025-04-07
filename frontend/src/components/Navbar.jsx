import React, { useEffect, useState } from "react";
import loginImage from "../assets/login.jpg";
import { IoMenu } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useStore from "../store/index";
import LogoutModal from "../components/LogoutModal";
import ResultModal from "../components/ResultModal"; // Import the ResultModal component
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import { AiOutlineClose } from "react-icons/ai";
import { SiGoogleclassroom } from "react-icons/si";


const Navbar = () => {
  const navigate = useNavigate();
  const { userLogout } = useStore();
  const [userName, setUserName] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false); // State for Result Modal

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    userLogout();
    navigate("/");
  };

  useEffect(() => {
    const user = localStorage.getItem("userName");
    setUserName(user);
  }, []);

  return (
    <div>
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
            onClick={handleClick}
          />
          <p>{userName}</p>
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => setIsLogoutModalOpen(true)}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Sidebar */}
      <div
        className={`shadow fixed top-0 left-0 h-full w-[300px] bg-[#fff] z-10 text-white transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ border: "1px solid #41122e" }}
      >
        <div className="p-5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#41122e]">Voter Dashboard</h2>
          <AiOutlineClose
            className="text-2xl text-[#41122e] cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
        <ul className="p-5 space-y-4">
          <li
            className="cursor-pointer text-[#41122e] hover:text-[#6d3b59] flex items-center gap-x-2"
            onClick={() => {
              setIsResultModalOpen(true);
              setIsSidebarOpen(false);
            }} // Open Result Modal
          >
            <SiGoogleclassroom />
            View Result
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <LogoutModal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />

      {/* Result Modal */}
      <ResultModal
        open={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
      />
    </div>
  );
};

export default Navbar;
