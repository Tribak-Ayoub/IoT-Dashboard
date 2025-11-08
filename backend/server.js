// ---------------------------------------------
// 🧠 Importing Required Modules
// ---------------------------------------------

import dotenv from "dotenv"; // Load environment variables from .env
dotenv.config(); // Load environment variables from .env file

import express from "express"; // Web framework for HTTP routes
import { WebSocketServer } from "ws"; // Real-time communication via WebSocket
import cors from "cors"; // Enables cross-origin requests
import { connectDB } from "./config/db.js"; // MongoDB connection function
import sensorRoutes from "./routes/sensorRoutes.js"; // Sensor routes

// ---------------------------------------------
// ⚙️ Create Express App
// ---------------------------------------------

const app = express(); // Initialize Express app

// ---------------------------------------------
// 🧩 Middleware Setup
// ---------------------------------------------

app.use(cors()); // Allow frontend (different origin) to access backend
app.use(express.json()); // Enable parsing of JSON request bodies

// ---------------------------------------------
// 🛢️ Connect to MongoDB
// ---------------------------------------------

await connectDB();

// Register routes
app.use("/api/sensors", sensorRoutes);

// Simple endpoint to check if backend is running
app.get("/", (req, res) => {
  res.send("IoT Backend is running");
});

// ---------------------------------------------
// 🌐 WebSocket Server Setup
// ---------------------------------------------

const wss = new WebSocketServer({ port: 8080 });
console.log("✅ WebSocket server running on ws://localhost:8080");

// Function to broadcast data to all clients
export function broadcastData(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(JSON.stringify(data));
  });
}

// ---------------------------------------------
// 🚀 Start HTTP Server
// ---------------------------------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
