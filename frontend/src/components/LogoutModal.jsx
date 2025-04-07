import React from "react";
import { Button, Modal, Box, Typography } from "@mui/material";

const LogoutModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose} >
      <Box
        className="bg-white p-5 rounded-lg shadow-lg"
        sx={{
          width: 500,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: 24,
          p: 4,
          textAlign: "center",
          borderRadius: "10px",
          outline:"1px solid #41122e"
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Confirm Logout
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Are you sure you want to log out?
        </Typography>
        <div className="flex justify-center gap-3">
          <Button variant="contained" onClick={onClose} sx={{bgcolor:"gray"}}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onConfirm} sx={{bgcolor:"#41122e"}}>
            Logout
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default LogoutModal;
