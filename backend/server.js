require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http"); // Add this
const { Server } = require("socket.io"); // Add this

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
// const path = require("path");

const app = express();
connectDB();

// const __dirname=path.resolve();


app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/candidates", require("./routes/candidateRoutes"));
app.use("/api/votes", require("./routes/voteRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/election", require("./routes/electionRoutes"));


// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*", // frontend URL
    methods: ["GET", "POST"]
  }
});

// Socket.IO logic
io.on("connection", (socket) => {

  socket.on("startVoting", () => {
    io.emit("votingStarted"); // Broadcast to all clients
  });

  socket.on("stopVoting", () => {
    io.emit("votingStopped"); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
  });
});

app.use("/api/voting-status", require("./routes/votingStatusRoutes"));

// app.use(express.static(path.join(__dirname,"/frontend/dist")));
// app.get("*",(req,res)=>{
//   res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
// });

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
