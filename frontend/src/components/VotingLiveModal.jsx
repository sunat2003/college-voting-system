import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const VotingLiveModal = ({ open }) => {
  const [openModal, setOpenModal] = useState(open);

  useEffect(() => {
    setOpenModal(open);
  }, [open]);

  return (
    <Modal
      open={openModal}
      onClose={() => {
        setOpenModal(false);
      }}
      sx={{ backdropFilter: "blur(4px)" }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 360,
          height: 420,
          bgcolor: "rgba(255, 255, 255, 0.05)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          borderRadius: 4,
          overflow: "hidden",
          color: "#fff",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backdropFilter: "blur(12px)",
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url("voting.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          p: 3,
        }}
      >
        <IconButton
          onClick={() => {
            setOpenModal(false);
          }}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#fff",
            backgroundColor: "rgba(0,0,0,0.3)",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ textShadow: "1px 1px 4px rgba(0,0,0,0.5)" }}>
            🗳 Voting is LIVE!
          </Typography>
          <Typography sx={{ mt: 2, fontSize: "1rem", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
            Cast your vote now and make your voice count!
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => {
            setOpenModal(false);
          }}
          sx={{
            mt: 3,
            bgcolor: "#ffffff",
            color: "#1a237e",
            fontWeight: "bold",
            borderRadius: "20px",
            py: 1,
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: "#e0e0e0",
              transform: "scale(1.05)",
            },
          }}
        >
          Got it!
        </Button>
      </Box>
    </Modal>
  );
};

export default VotingLiveModal;
