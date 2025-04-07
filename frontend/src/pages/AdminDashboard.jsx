import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { Button } from "@mui/material";
import useStore from "../store/index";
import AddCandidateModal from "../components/AddCandidateModal";
import socket from "../socket";
import axios from "axios";
import { GiChessKing } from "react-icons/gi";
import { FaRegChessQueen, FaChessBishop, FaChessKnight } from "react-icons/fa6";
import { SiChessdotcom } from "react-icons/si";
import CandidateCard from "../components/CandidateCard";
import UpdateCandidateModal from "../components/UpdateCandidateModal";
const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api`;

const AdminDashboard = () => {
  const {
    president,
    vicePresident,
    generalSecretary,
    jointSecretary,
    treasurer,
    fetchCandidatesByPresident,
    fetchCandidatesByVicePresident,
    fetchCandidatesByGeneralSecretary,
    fetchCandidatesByJointSecretary,
    fetchCandidatesByTreasurer,
    deleteCandidates,
  } = useStore();
  const [open, setOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [votingActive, setVotingActive] = useState(true);

  const handleDeleteCandidate = async (id) => {
    try {
      await deleteCandidates(id);
      fetchAllCandidates();
    } catch (error) {
      console.error(error);
    }
  };

  const startVoting = async () => {
    try {
      await axios.post(`${API_BASE_URL}/voting-status`, {
        isActive: true,
      });
      socket.emit("startVoting");
      setMessage("🟢 Voting started");
    } catch (err) {
      console.error("Error starting voting", err);
    }
  };

  const stopVoting = async () => {
    try {
      await axios.post(`${API_BASE_URL}/voting-status`, {
        isActive: false,
      });
      socket.emit("stopVoting");
      setMessage("🔴 Voting ended");
    } catch (err) {
      console.error("Error stopping voting", err);
    }
  };

  const fetchAllCandidates = () => {
    fetchCandidatesByPresident();
    fetchCandidatesByVicePresident();
    fetchCandidatesByGeneralSecretary();
    fetchCandidatesByJointSecretary();
    fetchCandidatesByTreasurer();
  };

  useEffect(() => {
    axios.get(`${API_BASE_URL}/voting-status`).then((res) => {
      setMessage(
        res.data.isActive
          ? "🟢 Voting has started!"
          : "🔴 Voting is currently unavailable."
      );
      setVotingActive(!res.data.isActive);
    });
  }, []);

  useEffect(() => {
    socket.on("votingStarted", () => {
      setMessage("🟢 Voting has started!");
      setVotingActive(false);
    });

    socket.on("votingStopped", () => {
      setMessage("🔴 Voting has ended.");
      setVotingActive(true);
    });

    return () => {
      socket.off("votingStarted");
      socket.off("votingStopped");
    };
  }, []);

  useEffect(() => {
    fetchAllCandidates();
  }, []);

  const renderCandidateSection = (title, Icon, candidates) => (
    <div className="w-full sm:p-10 p-3 bg-[#fff] rounded-[5px] flex flex-col gap-y-5">
      <h1 className="flex gap-x-2 py-1 items-center text-lg font-semibold">
        <Icon className="text-[#41122e]" />
        {title}
      </h1>

      {candidates.length > 0 ? (
        <div className="flex flex-wrap justify-between gap-y-5">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate._id}
              candidate={candidate}
              onDelete={() => handleDeleteCandidate(candidate._id)}
              onUpdate={() => {
                setSelectedCandidate(candidate);
                setIsUpdateModalOpen(true);
              }}
              votingActive={!votingActive}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No {title.toLowerCase()} available.
        </div>
      )}
    </div>
  );

  return (
    <div className="w-screen h-auto bg-[#eee]">
      <AdminNavbar />
      <section className="w-full h-[85%] p-5 flex flex-col gap-y-2">
        <div className="w-full p-2 flex justify-between">
          <div className="flex gap-x-5 items-center">
            <Button
              variant="contained"
              sx={{
                background: "gray",
                fontSize: { xs: "10px", sm: "12px" },
                px: { xs: 1, sm: 2, md: 4 },
                py: { xs: 0.5, sm: 1, md: 1.5 },
              }}
              onClick={startVoting}
            >
              Start Voting
            </Button>
            <Button
              variant="contained"
              onClick={stopVoting}
              sx={{
                background: "#41122e",
                fontSize: { xs: "10px", sm: "12px" },
                px: { xs: 1, sm: 2, md: 4 },
                py: { xs: 0.5, sm: 1, md: 1.5 },
              }}
            >
              Stop Voting
            </Button>
          </div>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            disabled={!votingActive}
            sx={{
              background: "#41122e",
              fontSize: { xs: "10px", sm: "12px" },
              px: { xs: 1, sm: 2, md: 4 },
              py: { xs: 0.5, sm: 1, md: 1.5 },
            }}
          >
            Add Candidates
          </Button>
        </div>

        {message && (
          <div className="mb-4 p-5 bg-white shadow-md rounded">{message}</div>
        )}

        {/* Candidate Sections */}
        {renderCandidateSection("President Candidates", GiChessKing, president)}
        {renderCandidateSection("Vice President Candidates", FaRegChessQueen, vicePresident)}
        {renderCandidateSection("General Secretary Candidates", FaChessBishop, generalSecretary)}
        {renderCandidateSection("Joint Secretary Candidates", FaChessKnight, jointSecretary)}
        {renderCandidateSection("Treasurer Candidates", SiChessdotcom, treasurer)}
      </section>

      <AddCandidateModal open={open} handleClose={() => setOpen(false)} />

      <UpdateCandidateModal
        open={isUpdateModalOpen}
        handleClose={() => setIsUpdateModalOpen(false)}
        candidateData={selectedCandidate}
        onUpdated={() => {
          fetchAllCandidates();
          setIsUpdateModalOpen(false);
        }}
      />
    </div>
  );
};

export default AdminDashboard;
