// ---------------------------------------------
// Importing Required Modules
// ---------------------------------------------

import dotenv from "dotenv"; // Load environment variables from .env
dotenv.config(); // Load environment variables from .env file

import express from "express"; // Web framework for HTTP routes
import http from "http"; // Required to attach Socket.IO
import { Server as SocketIOServer } from "socket.io";
import cors from "cors"; // Enables cross-origin requests
import morgan from "morgan";

import { connectDB } from "./config/db.js"; // MongoDB connection function
import sensorRoutes from "./routes/sensorRoutes.js"; // Sensor routes
import { errorHandler } from "./middlewares/errorHandler.js";

// ---------------------------------------------
// ⚙️ Create Express App
// ---------------------------------------------

const app = express(); // Initialize Express app
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ---------------------------------------------
// CORS Configuration
// ---------------------------------------------
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ---------------------------------------------
// Socket.IO Setup
// ---------------------------------------------
const io = new SocketIOServer(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Helper function to broadcast data
export function broadcastSensorData(data) {
  io.emit("sensor:update", data); // Emit event to all connected clients
}

// ---------------------------------------------
// Middleware Setup
// ---------------------------------------------
app.use(express.json()); // Enable parsing of JSON request bodies
app.use(morgan("dev")); // Log HTTP requests to console

// ---------------------------------------------
// Connect to MongoDB
// ---------------------------------------------
await connectDB();

// Register routes
app.use("/api/sensors", sensorRoutes);

// Simple endpoint to check if backend is running
app.get("/", (req, res) => {
  res.send("IoT Backend is running");
});

// Register global error handler after all routes
app.use(errorHandler);

// ---------------------------------------------
// 🚀 Start HTTP Server
// ---------------------------------------------

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
