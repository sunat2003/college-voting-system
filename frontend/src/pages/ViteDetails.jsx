import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import VoteTable from '../components/VoteTable';

const VoterDetails = () => {
  return (
    <div className="w-screen h-screen">
      <AdminNavbar />
      <section className="w-full bg-[#eee] p-10">
        <VoteTable/>
      </section>
    </div>
  );
};

export default VoterDetails;
