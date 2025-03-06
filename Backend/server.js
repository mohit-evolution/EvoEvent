const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors")
const authRoutes = require("./Routes/userRoutes")
const eventRoutes = require("./Routes/eventRoutes");
dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // Middleware for JSON parsing
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads")); // Serve images statically
// Routes
app.use("/api/events", eventRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
