const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./Config/db");
const cors = require("cors")
const authRoutes = require("./Routes/userRoutes")
const eventRoutes = require("./Routes/eventRoutes")
const categoryRoutes = require('./Routes/categoryRoutes')
dotenv.config();
connectDB();

const app = express();
app.use(express.json()); 
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads")); 
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/category",categoryRoutes)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
