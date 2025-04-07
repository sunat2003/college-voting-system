// middleware/verifyToken.js
const jwt = require("jsonwebtoken");
require("dotenv").config();


const verifyUserToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1]; // Assuming format is "Bearer <token>"

  jwt.verify(token, process.env.JWT_USER_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = decoded; // Save decoded user info for later use
    next();
  });
};

module.exports = verifyUserToken;
