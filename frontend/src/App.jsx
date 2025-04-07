import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import necessary components
import PrivateRoutes from "./components/PrivateRoutes";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPrivateRoute from './components/AdminPrivateRoute';
import Voter from './pages/Voter';
import VoterDetails from "./pages/ViteDetails";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Defining different routes for different components */}
          <Route path="/admin/signup" element={<AdminPrivateRoute><Signup/></AdminPrivateRoute>} />
          <Route path="/admin/voter-list" element={<AdminPrivateRoute><Voter/></AdminPrivateRoute>} />
          <Route path="/admin/votes" element={<AdminPrivateRoute><VoterDetails/></AdminPrivateRoute>} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoutes><Dashboard/></PrivateRoutes>} />
          <Route path="/admin" element={<AdminPrivateRoute><AdminDashboard/></AdminPrivateRoute>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
