import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { Button } from "@mui/material";
import useStore from "../store/index";
import AddCandidateModal from "../components/AddCandidateModal";
import socket from "../socket";
import axios from "axios";
import { GiChessKing } from "react-icons/gi";
import { FaRegChessQueen } from "react-icons/fa6";
import { SiChessdotcom } from "react-icons/si";
import { FaChessBishop } from "react-icons/fa6";
import { FaChessKnight } from "react-icons/fa6";
import CandidateCard from "../components/CandidateCard";
import UpdateCandidateModal from "../components/UpdateCandidateModal";
const API_BASE_URL =`${import.meta.env.VITE_APP_BASE_URL}/api`;



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

  const handleDeleteCandidate = async (id) => {
    try {
      await deleteCandidates(id);
      fetchCandidatesByPresident();
      fetchCandidatesByVicePresident();
      fetchCandidatesByGeneralSecretary();
      fetchCandidatesByJointSecretary();
      fetchCandidatesByTreasurer();
    } catch (error) {
      console.error(error);
    }
  };

  const [message, setMessage] = useState("");
  const [votingActive, setVotingActive] = useState(true);

  const startVoting = async () => {
    try {
      await axios.post(`${API_BASE_URL}/voting-status`, {
        isActive: true,
      });

      socket.emit("startVoting"); // real-time trigger
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

      socket.emit("stopVoting"); // real-time trigger
      setMessage("🔴 Voting ended");
    } catch (err) {
      console.error("Error stopping voting", err);
    }
  };

  // Fetch voting status from DB on mount
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
  // Listen to socket events
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
    fetchCandidatesByPresident();
    fetchCandidatesByVicePresident();
    fetchCandidatesByGeneralSecretary();
    fetchCandidatesByJointSecretary();
    fetchCandidatesByTreasurer();
  }, []);

  return (
    <div className="w-screen h-auto bg-[#eee]">
      <AdminNavbar />
      <section className="w-full h-[85%] p-5 flex flex-col gap-y-2">
        <div className="w-full p-2  flex justify-between">
          <div className="flex gap-x-5 items-center">
            <Button
              variant="contained"
              sx={{
                background: "gray",
                fontSize: { xs: "10px", sm: "12px"}, // small on xs/sm, default on md+
                px: { xs: 1, sm: 2, md: 4 }, // optional: responsive padding
                py: { xs: 0.5, sm: 1, md: 1.5 }, // optional
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
                fontSize: { xs: "10px", sm: "12px"}, // small on xs/sm, default on md+
                px: { xs: 1, sm: 2, md: 4 },
                py: { xs: 0.5, sm: 1, md: 1.5 }, // optional
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
              fontSize: { xs: "10px", sm: "12px"}, // small on xs/sm, default on md+
              px: { xs: 1, sm: 2, md: 4 },
              py: { xs: 0.5, sm: 1, md: 1.5 }, // optional
            }}
          >
            Add Candidates
          </Button>
        </div>
        {message && (
          <div className="mb-4 p-5 bg-white shadow-md rounded">{message}</div>
        )}

        <div className="w-full sm:p-10 p-3 bg-[#fff] rounded-[#5px] flex flex-col gap-y-5">
          <h1 className="flex gap-x-2 py-1 items-center">
            <GiChessKing className="text-[#41122e]" /> President Candidates
          </h1>

          <div className="flex flex-wrap justify-between gap-y-5">
            {president.map((candidate) => (
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
        </div>
        <div className="w-full sm:p-10 p-3 bg-[#fff] rounded-[#5px] flex flex-col gap-y-5">
          <h1 className="flex gap-x-2 py-1 items-center">
            <FaRegChessQueen className="text-[#41122e]" />
            Vice President Candidates
          </h1>

          <div className="flex flex-wrap justify-between gap-y-5">
            {vicePresident.map((candidate) => (
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
        </div>
        <div className="w-full sm:p-10 p-3 bg-[#fff] rounded-[#5px] flex flex-col gap-y-5">
          <h1 className="flex gap-x-2 py-1 items-center">
            <FaChessBishop className="text-[#41122e]" />
            General Secretary Candidates
          </h1>

          <div className="flex flex-wrap justify-between gap-y-5">
            {generalSecretary.map((candidate) => (
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
        </div>
        <div className="w-full sm:p-10 p-3 bg-[#fff] rounded-[#5px] flex flex-col gap-y-5">
          <h1 className="flex gap-x-2 py-1 items-center">
            <FaChessKnight className="text-[#41122e]" />
            Joint Secretary Candidates
          </h1>

          <div className="flex flex-wrap justify-between gap-y-5">
            {jointSecretary.map((candidate) => (
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
        </div>
        <div className="w-full sm:p-10 p-3 bg-[#fff] rounded-[#5px] flex flex-col gap-y-5">
          <h1 className="flex gap-x-2 py-1 items-center">
            <SiChessdotcom className="text-[#41122e]" />
            Treasurer Candidates
          </h1>

          <div className="flex flex-wrap justify-between gap-y-5">
            {treasurer.map((candidate) => (
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
        </div>
      </section>

      {/* Add Candidate Modal */}
      <AddCandidateModal
        open={open}
        handleClose={() => setOpen(false)}
        // onCandidateAdded={fetchCandidates}
      />

      <UpdateCandidateModal
        open={isUpdateModalOpen}
        handleClose={() => setIsUpdateModalOpen(false)}
        candidateData={selectedCandidate}
        onUpdated={() => {
          fetchCandidatesByPresident();
          fetchCandidatesByVicePresident();
          fetchCandidatesByGeneralSecretary();
          fetchCandidatesByJointSecretary();
          fetchCandidatesByTreasurer();
          setIsUpdateModalOpen(false);
        }}
      />
    </div>
  );
};

export default AdminDashboard;
