import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { Modal, Box, Typography, Button, Divider } from "@mui/material";
import WinnerAnimation from "./lottie/WinnerAnimation";

const API_BASE_URL =`${import.meta.env.VITE_APP_BASE_URL}/api`;
const token = localStorage.getItem("token");


const ResultModal = ({ open, onClose }) => {
  const [presidentWinner, setPresidentWinner] = useState([]);
  const [vicePresidentWinner, setVicePresidentWinner] = useState([]);
  const [generalSecretary, setGeneralSecretary] = useState([]);
  const [jointSecretary, setJointSecretary] = useState([]);
  const [treasurer, setTreasurer] = useState([]);
  const [winMessage, setWinMessage] = useState(false);

  useEffect(() => {
    const fetchStatusAndWinners = async () => {
      try {
        const statusRes = await axios.get(`${API_BASE_URL}/election/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWinMessage(statusRes.data?.showWinners);

        if (statusRes.data?.showWinners) {
          const winnerRes = await axios.get(
            `${API_BASE_URL}/candidates/winners/position`
          );
          setPresidentWinner(winnerRes.data?.winners?.President);
          setVicePresidentWinner(winnerRes.data?.winners?.["Vice President"]);
          setGeneralSecretary(winnerRes.data?.winners?.["General Secretary"]);
          setJointSecretary(winnerRes.data?.winners?.["Joint Secretary"]);
          setTreasurer(winnerRes.data?.winners?.Treasurer);
        }
      } catch (error) {
        console.error("Error fetching election results", error);
      }
    };

    if (open) {
      fetchStatusAndWinners();
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="election-results">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          height: "90%",
          // maxWidth: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#41122e" }}>
            Election Results
          </Typography>
          <AiOutlineClose
            style={{ cursor: "pointer", fontSize: "1.5rem" }}
            onClick={onClose}
          />
        </Box>
        <Divider sx={{ my: 2 }} />

        {/* Results */}
        {winMessage ? (
          <div className="w-full flex md:flex-row flex-col  md:justify-between md:items-start items-center h-[79%] overflow-auto gap-5">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-[#e12b99]">President Winners</h1>
              <div className="w-full flex flex-col gap-y-5">
                {presidentWinner.map((winner, index) => (
                  <div key={index} className="relative rounded-lg w-[250px]">
                    <div className="border-wrapper p-[2px] rounded-lg bg-gradient-to-r from-[#2d052d] via-[#fff] to-[#2d052d]">
                      <div className="p-3 bg-white rounded-lg flex justify-center items-center gap-x-5">
                        <img
                          src={`${import.meta.env.VITE_APP_BASE_URL}${winner?.image}`}
                          alt=""
                          className="w-[60px] h-[60px] rounded-[50%]"
                        />
                        <div>
                          <p>{winner?.name}</p>
                          <p>Total Votes : {winner?.voteCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <h1 className="text-[#e12b99]"> Vice President Winners</h1>
              <div className="w-full flex flex-col gap-y-2">
                {vicePresidentWinner.map((winner, index) => (
                  <div key={index} className="relative rounded-lg w-[250px]">
                    <div className="border-wrapper p-[2px] rounded-lg bg-gradient-to-r from-[#2d052d] via-[#fff] to-[#2d052d]">
                      <div className="p-3 bg-white rounded-lg flex justify-center items-center gap-x-5">
                        <img
                          src={winner?.image}
                          alt=""
                          className="w-[60px] h-[60px] rounded-[50%]"
                        />
                        <div>
                          <p>{winner?.name}</p>
                          <p>Total Votes : {winner?.voteCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <h1 className="text-[#e12b99]">General Secretary Winners</h1>
              <div className="w-full flex flex-col gap-y-2">
                {generalSecretary.map((winner, index) => (
                  <div key={index} className="relative rounded-lg w-[250px]">
                    <div className="border-wrapper p-[2px] rounded-lg bg-gradient-to-r from-[#2d052d] via-[#fff] to-[#2d052d]">
                      <div className="p-3 bg-white rounded-lg flex justify-center items-center gap-x-5">
                        <img
                          src={`${import.meta.env.VITE_APP_BASE_URL}${winner?.image}`}
                          alt=""
                          className="w-[60px] h-[60px] rounded-[50%]"
                        />
                        <div>
                          <p>{winner?.name}</p>
                          <p>Total Votes : {winner?.voteCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <h1 className="text-[#e12b99]">Joint Secretary Winners</h1>
              <div className="w-full flex flex-col gap-y-2">
                {jointSecretary.map((winner, index) => (
                  <div key={index} className="relative rounded-lg w-[250px]">
                    <div className="border-wrapper p-[2px] rounded-lg bg-gradient-to-r from-[#2d052d] via-[#fff] to-[#2d052d]">
                      <div className="p-3 bg-white rounded-lg flex justify-center items-center gap-x-5">
                        <img
                          src={`${import.meta.env.VITE_APP_BASE_URL}${winner?.image}`}
                          alt=""
                          className="w-[60px] h-[60px] rounded-[50%]"
                        />
                        <div>
                          <p>{winner?.name}</p>
                          <p>Total Votes : {winner?.voteCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <h1 className="text-[#e12b99]">Treasurer Winners</h1>
              <div className="w-full flex flex-col gap-y-2">
                {treasurer.map((winner, index) => (
                  <div key={index} className="relative rounded-lg w-[250px]">
                    <div className="border-wrapper p-[2px] rounded-lg bg-gradient-to-r from-[#2d052d] via-[#fff] to-[#2d052d]">
                      <div className="p-3 bg-white rounded-lg flex justify-center items-center gap-x-5">
                        <img
                          src={`${import.meta.env.VITE_APP_BASE_URL}${winner?.image}`}
                          alt=""
                          className="w-[60px] h-[60px] rounded-[50%]"
                        />
                        <div>
                          <p>{winner?.name}</p>
                          <p>Total Votes : {winner?.voteCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <WinnerAnimation />
          </div>
        ) : (
          <Typography textAlign="center" color="gray" sx={{ height: "78%" }}>
            Winners will be announced soon...
          </Typography>
        )}
        {/* Close Button */}
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button
            variant="contained"
            sx={{ bgcolor: "#41122e" }}
            onClick={onClose}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// /* Reusable Winner Display Component */
// const ResultSection = ({ title, winner }) => (
//   <Box mb={2}>
//     <Typography variant="subtitle1" fontWeight="bold">
//       {title}
//     </Typography>
//     {winner.length > 0 ? (
//       winner.map((w, index) => (
//         <Typography key={index} color="textSecondary">
//           {w.name} ({w.party}) - Votes: {w.voteCount}
//         </Typography>
//       ))
//     ) : (
//       <Typography color="gray" fontSize="small">
//         No winner declared yet.
//       </Typography>
//     )}
//   </Box>
// );

export default ResultModal;
