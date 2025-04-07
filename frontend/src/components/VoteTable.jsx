import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
const adminToken = localStorage.getItem("adminToken");



const API_BASE_URL =`${import.meta.env.VITE_APP_BASE_URL}/api`;

const VoteTable = () => {
  const [votes, setVotes] = useState([]);

  const fetchVotes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/votes/vote` ,{
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const formattedVotes = res.data.votes.map((vote) => ({
        id: vote._id,
        voterId: vote.userId?.voterId,
        username: vote.userId?.username,
        candidateName: vote.candidateId?.name,
        party: vote.candidateId?.party,
        position: vote.position,
      }));
      setVotes(formattedVotes);
    } catch (err) {
      console.error("Failed to fetch votes", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vote?")) {
      try {
        await axios.delete(`${API_BASE_URL}/votes/vote/${id}`,{
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        setVotes((prev) => prev.filter((vote) => vote.id !== id));
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  const columns = [
    { field: "id", headerName: "Vote ID", flex: 1 },
    { field: "voterId", headerName: "Voter ID", flex: 1 },
    { field: "username", headerName: "Voter Name", flex: 1 },
    { field: "candidateName", headerName: "Candidate", flex: 1 },
    { field: "party", headerName: "Party", flex: 1 },
    { field: "position", headerName: "Position", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDelete(params.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid rows={votes} columns={columns} pageSize={5} />
    </div>
  );
};

export default VoteTable;
