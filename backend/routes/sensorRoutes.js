import express from "express";
import SensorReading from "../models/SensorReading";

const router = express.Router();

/**
 * POST /api/sensors
 * Receives a new sensor reading and saves it to MongoDB.
 * Example payload:
 * {
 *   "deviceId": "DEVICE_001",
 *   "temperature": 26.5,
 *   "humidity": 40
 * }
 */
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

    res.status(201).json({
      message: "Sensor reading saved successfully",
      data: newSensorReading,
    });
  } catch (error) {
    console.error("Error saving sensor reading:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

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
