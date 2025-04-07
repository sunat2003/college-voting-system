import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import useStore from "../store/index";
import { MdDelete, MdEdit } from "react-icons/md";

const paginationModel = { page: 0, pageSize: 10 };

const VoterList = () => {
  const { voters, fetchVoters, deleteVoters } = useStore();

  useEffect(() => {
    fetchVoters();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteVoters(id);
      await fetchVoters();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 50,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center h-full">
          <MdDelete
            onClick={() => handleDelete(params.row._id)}
            className="text-xl hover:text-red-600 hover:cursor-pointer"
          />
        </div>
      ),
    },
    { field: "username", headerName: "UserName", width: 200 },
    { field: "rollNumber", headerName: "RollNumber", width: 200 },
    { field: "department", headerName: "Department", width: 200 },
    { field: "branch", headerName: "Branch", width: 200 },
    { field: "gender", headerName: "Gender", width: 200 },
    { field: "voterId", headerName: "VoterId", width: 200 },
  ];

  return (
   <div>
     <Paper sx={{ height: 550, width: "100%" ,position:"relative", zIndex:"0" }}>
      <DataGrid
        rows={voters.map((voter) => ({ ...voter, id: voter._id }))}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{
          border: 0,
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "transparent",
          },
        }}
      />
    </Paper>
   </div>
  );
};

export default VoterList;
