import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import VoterList from '../components/VoterList';

const Voter = () => {
  return (
    <div className="w-screen h-screen">
      <AdminNavbar />
      <section className="w-full bg-[#eee] p-10">
        <VoterList/>
      </section>
    </div>
  );
};

export default Voter;
