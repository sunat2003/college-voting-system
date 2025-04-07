// components/CandidateCard.jsx
import { Button } from "@mui/material";
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const CandidateCard = ({ candidate, onDelete, onUpdate, votingActive }) => {
  return (
    <div
      className="sm:p-5 p-2 shadow-xl rounded-[5px] sm:w-[250px] sm:h-[350px]  w-[145px] h-[245px]"
      style={{ border: "1px solid #41122e" }}
    >
      <div className="w-full flex justify-center items-center h-[40%]">
        <img
          src={`${API_BASE_URL}${candidate?.image}`}
          alt="candidate"
          className="sm:w-[100px] sm:h-[100px] w-[60px] h-[60px] rounded-[50%]"
        />
      </div>
      <div className="flex flex-col h-1/3 w-full p-2 gap-y-1">
        <p className="text-[#41122e] font-bold sm:text-xl text-sm">
          {candidate?.name}
        </p>
        <p className="sm:text-[12px] text-[8px]">{candidate?.party}</p>
        <p className="sm:text-[15px] text-[8px] text-gray-500">
          {candidate?.department}
        </p>
        <div className="text-[blue] sm:text-[20px] text-[8px]">
          Total Votes:{" "}
          <span className="text-[red]">{candidate?.voteCount}</span>
        </div>
      </div>
      <div className="flex h-1/3 sm:gap-5 gap-x-1 items-center justify-center">
        <Button
          disabled={votingActive}
          variant="contained"
          sx={{
            background: "gray",
            fontSize: { xs: "10px", sm: "12px"}, // small on xs/sm, default on md+
            px: { xs: 1, sm: 2, md: 4 }, // optional: responsive padding
            py: { xs: 0.5, sm: 1, md: 1.5 }, // optional
          }}
          onClick={onUpdate}
        >
          Update
        </Button>

        <Button
          disabled={votingActive}
          variant="contained"
          sx={{
            background: "#41122e",
            fontSize: { xs: "10px", sm: "12px"}, // small on xs/sm, default on md+
            px: { xs: 1, sm: 2, md: 4 },
            py: { xs: 0.5, sm: 1, md: 1.5 }, // optional
          }}
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default CandidateCard;
