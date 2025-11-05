// ---------------------------------------------
// 🧠 Importing Required Modules
// ---------------------------------------------

import dotenv from "dotenv"; // Load environment variables from .env
dotenv.config(); // Load environment variables from .env file

import express from "express"; // Web framework for HTTP routes
import { WebSocketServer } from "ws"; // Real-time communication via WebSocket
import SensorReading from "./models/SensorReading.js"; // SensorReading model
import cors from "cors"; // Enables cross-origin requests
import { connectDB } from "./config/db.js"; // MongoDB connection function

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

// Simple endpoint to check if backend is running
app.get("/", (req, res) => {
  res.send("IoT Backend is running");
});

// POST route to receive sensor data
app.post("/api/sensors", async (req, res) => {
  try {
    const { deviceId, temperature, humidity } = req.body;
    const reading = new SensorReading({ deviceId, temperature, humidity });
    await reading.save();

    broadcastData(reading);
    res.status(201).json(reading);
  } catch (error) {
    console.error("Error saving sensor data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------
// 🚀 Start HTTP Server
// ---------------------------------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
