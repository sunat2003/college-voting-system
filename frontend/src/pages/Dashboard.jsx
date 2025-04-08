import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import { GrUserAdmin } from "react-icons/gr";
import useStore from "../store/index";
import { FaGraduationCap } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LottieAnimation from "../components/LottieAnimation";
import socket from "../socket";
import { FaChessKing } from "react-icons/fa";
import VotingLiveModal from '../components/VotingLiveModal';
import { axiosInstance } from "../store/index";


const API_BASE_URL =`${import.meta.env.VITE_APP_BASE_URL}/api`;
const token = localStorage.getItem("token");




const positions = [
  "President",
  "Vice President",
  "General Secretary",
  "Joint Secretary",
  "Treasurer", // You can change this to any 5th position
];

const Dashboard = () => {
  const {
    userLogout,
    position,
    publicCandidates,
    fetchPublicCandidates,
    fetchCandidatesByPosition,
  } = useStore();
  const [open, setOpen] = useState(false);
  const [openPositionModal, setOpenPositionModal] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const navigate = useNavigate();
  const [votingActive, setVotingActive] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPublicCandidates();
  }, []);

  const handleVote = async (id) => {
    const voterID = localStorage.getItem("voterId");
    const payload = {
      candidateId: id,
      voterId: voterID,
    };

    try {
      const res = await axiosInstance.post(
        `${API_BASE_URL}/votes/vote`,
        payload
      );
      setOpen(false);
      setVoteSuccess(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
        console.error(error);
      }
    }
  };

  // Fetch voting status from DB on mount
  useEffect(() => {
    axios.get(`${API_BASE_URL}/voting-status`).then((res) => {
      setVotingActive(res.data.isActive);
      setMessage(
        res.data.isActive
          ? "🟢 Voting has started!"
          : "🔴 Voting is currently unavailable."
      );
    });
  }, []);

  // Listen to socket events
  useEffect(() => {
    socket.on("votingStarted", () => {
      setVotingActive(true);
      setMessage("🟢 Voting has started!");
    });

    socket.on("votingStopped", () => {
      setVotingActive(false);
      setMessage("🔴 Voting has ended.");
    });

    return () => {
      socket.off("votingStarted");
      socket.off("votingStopped");
    };
  }, []);

  return (
    <div className="w-screen bg-[#eee]">
      <Navbar />
      <section className="w-full h-[85%] p-5">
        <div className="w-full pb-5 flex justify-between">
          <h1 className="text-xl px-2 flex gap-x-2 items-center">
            <FaGraduationCap />
            All Candidates
          </h1>
          <Button
            variant="contained"
            sx={{ background: "#41122e" }}
            onClick={() => setOpenPositionModal(true)}
            className={`px-4 py-2 rounded ${
              votingActive ? "bg-green-500" : "bg-gray-400"
            }`}
            disabled={!votingActive}
          >
            Start Voting
          </Button>
        </div>
        {message && (
          <div className="mb-4 p-2 bg-white shadow-md rounded">
            <marquee behavior="alternate" direction="right">
              {message}
            </marquee>
          </div>
        )}

        <div className="w-full p-10 bg-[#fff] rounded-[#5px] flex flex-wrap justify-between gap-y-5">
          {publicCandidates.map((candidate) => (
            <div
              key={candidate._id}
              className="p-5 shadow-xl rounded-[5px] w-[300px] h-[200px] flex items-center"
              style={{ border: "1px solid #41122e" }}
            >
              <div className="w-[50%] flex items-center h-[100%]">
                <img
                  src={candidate?.image}
                  alt=""
                  className="w-[100px] h-[100px] rounded-[50%]"
                />
              </div>
              <div className="flex flex-col h-full w-1/2 p-2 gap-y-1 justify-center">
                <p className="text-[#41122e] font-bold text-xl">
                  {candidate?.name}
                </p>
                <p className="text-[12px]">{candidate?.party}</p>
                <p className="text-[15px] text-gray-500">
                  {candidate?.department}
                </p>
                <p className="text-[#e12b99] font-bold text-md">
                  {candidate?.position}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Position Modal */}

        <Modal
          open={openPositionModal}
          onClose={() => setOpenPositionModal(false)}
          aria-labelledby="position-modal"
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
              width: 350,
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, color: "#41122e", textAlign: "center" }}
            >
              Available Positions
            </Typography>
            <List>
              {positions.map((position, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <FaChessKing className="text-[#41122e]" />
                  </ListItemIcon>
                  <ListItemText primary={position} />
                  <Button
                    variant="contained"
                    sx={{ background: "#41122e" }}
                    onClick={() => {
                      setOpenPositionModal(false);
                      fetchCandidatesByPosition(position);
                      setOpen(true);
                    }}
                    className={`px-4 py-2 rounded ${
                      votingActive ? "bg-green-500" : "bg-gray-400"
                    }`}
                    disabled={!votingActive}
                  >
                    Go
                  </Button>
                </ListItem>
              ))}
            </List>
          </Box>
        </Modal>

        {/* Voting Modal */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[80vh] overflow-auto bg-white p-5 rounded-lg shadow-lg sm:w-[600px] w-[350px]">
            <h2 className="text-center text-xl font-bold mb-4">
              Vote for a Candidate
            </h2>
            <div className="flex flex-col gap-4">
              {position.map((candidate) => (
                <div
                  key={candidate._id}
                  className="flex items-center justify-between border p-2 rounded"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={candidate?.image}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full"
                    />
                    <div>
                      <p className="font-bold">{candidate?.name}</p>
                      <p className="text-sm text-gray-500">
                        {candidate?.party}
                      </p>
                      <p className="font-bold text-[#ca298a] text-md">
                        {candidate?.position}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="contained"
                    onClick={() => handleVote(candidate._id)}
                    sx={{
                      background: "#41122e",
                      fontSize: { xs: "10px", sm: "12px"}, // small on xs/sm, default on md+
                      px: { xs: 1, sm: 2, md: 4 },
                      py: { xs: 0.5, sm: 1, md: 1.5 }, // optional
                    }}
                    className={`px-4 py-2 rounded ${
                      votingActive ? "bg-green-500" : "bg-gray-400"
                    }`}
                    disabled={!votingActive}
                  >
                    Vote Now
                  </Button>
                </div>
              ))}
            </div>
          </Box>
        </Modal>

        {/* Vote Success Modal */}
        <Modal open={voteSuccess} onClose={() => setVoteSuccess(false)}>
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg w-[300px] text-center">
            <h2 className="text-lg font-bold">
              Your vote has been counted successfully!
            </h2>
            <div className="w-full flex justify-center">
              <LottieAnimation />
            </div>
            <div className="w-full flex justify-center gap-x-2 items-center">
              <Button
                variant="contained"
                className="mt-4"
                onClick={() => setVoteSuccess(false)}
                sx={{ bgcolor: "gray" }}
              >
                OK
              </Button>
              <Button
                variant="contained"
                className="mt-4"
                onClick={() => {
                  userLogout();
                  navigate("/");
                }}
                sx={{ bgcolor: "#41122e" }}
              >
                Exit Here
              </Button>
            </div>
          </Box>
        </Modal>

        <VotingLiveModal open={votingActive} />
      </section>
    </div>
  );
};

export default Dashboard;
