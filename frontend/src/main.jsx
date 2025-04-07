import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer
        position="bottom-left"
        hideProgressBar={true}
        closeOnClick
        draggable
        closeButton={false}
        pauseOnHover
        toastClassName={() =>
          "bg-[#41122e] text-white rounded-[5px] p-2 px-3 shadow-lg font-sans text-sm animate-toast-slide flex items-center"
        }
        bodyClassName={() => "p-0 m-0"}
      />

    <App />
  </StrictMode>
);
