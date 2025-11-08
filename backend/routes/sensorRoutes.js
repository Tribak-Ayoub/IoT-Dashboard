import express from "express";
import SensorReading from "../models/SensorReading.js";
import { broadcastSensorData } from "../server.js";

const router = express.Router();

// POST /api/sensors → Add a new sensor reading
router.post("/", async (req, res) => {
  try {
    const { deviceId, temperature, humidity } = req.body;

    if (!deviceId || temperature === undefined || humidity === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newSensorReading = new SensorReading({
      deviceId,
      temperature,
      humidity,
    });
    await newSensorReading.save();

    // Broadcast live update
    broadcastSensorData(newSensorReading);

    res.status(201).json({
      message: "Sensor reading saved successfully",
      data: newSensorReading,
    });
  } catch (error) {
    console.error("Error saving sensor reading:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/sensors?limit=10 → Get last N readings
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const readings = await SensorReading.find()
      .sort({ timestamp: -1 })
      .limit(limit);
    res.json(readings);
  } catch (error) {
    console.error("Error fetching sensor readings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /api/sensors → Delete all readings (for testing)
router.delete("/", async (req, res) => {
  console.log("🗑️ DELETE request received at /api/sensors");
  try {
    await SensorReading.deleteMany({});
    res.json({ message: "All sensor readings deleted successfully" });
  } catch (error) {
    console.error("Error deleting sensor readings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
