// ---------------------------------------------
// 🧠 Importing Required Modules
// ---------------------------------------------

import express from "express"; // Web framework for HTTP routes
import { WebSocketServer } from "ws"; // Real-time communication via WebSocket
import mongoose from "mongoose"; // MongoDB ODM
import SensorReading from "./models/SensorReading.js"; // SensorReading model
import cors from "cors"; // Enables cross-origin requests
import dotenv from "dotenv"; // Load environment variables from .env

// Load environment variables from .env file
dotenv.config();

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

try {
  await mongoose.connect(
    "mongodb+srv://tribak:password0000@iot-db.irbecri.mongodb.net/?appName=IoT-DB"
  );
  console.log("✅ Connected to MongoDB");
} catch (error) {
  console.error("❌ MongoDB connection error:", error);
}

// ---------------------------------------------
// 🌐 WebSocket Server Setup
// ---------------------------------------------

const wss = new WebSocketServer({ port: 8080 });
console.log("✅ WebSocket server running on ws://localhost:8080");

// ---------------------------------------------
// 🔄 Simulate Sensor Data
// ---------------------------------------------

setInterval(async () => {
  // Generate random sensor readings
  const data = {
    deviceId: "device-001",
    temperature: Math.floor(Math.random() * 30) + 15, // 15–44°C
    humidity: Math.floor(Math.random() * 50) + 30, // 30–79%
  };

  // Save sensor reading to MongoDB
  const reading = new SensorReading(data);
  await reading.save();

  // Broadcast data to all connected WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      // 1 = OPEN
      client.send(JSON.stringify(data));
    }
  });

  console.log("📡 New data saved and broadcasted:", data);
}, 5000); // Run every 5 seconds

// ---------------------------------------------
// 🧪 Health Check Route
// ---------------------------------------------

// Simple endpoint to check if backend is running
app.get("/", (req, res) => {
  res.send("IoT Backend is running");
});

// ---------------------------------------------
// 🚀 Start HTTP Server
// ---------------------------------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
