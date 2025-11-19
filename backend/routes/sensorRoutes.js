import express from "express";
import SensorReading from "../models/SensorReading.js";
import { broadcastSensorData } from "../server.js";

const router = express.Router();

// POST /api/sensors → Add a new sensor reading
router.post("/", async (req, res, next) => {
  try {
    const { deviceId, temperature, humidity } = req.body;

    if (!deviceId || temperature === undefined || humidity === undefined) {
      const error = new Error("Missing required fields");
      error.statusCode = 400;
      throw error;
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
      success: true,
      message: "Sensor reading saved successfully",
      data: newSensorReading,
    });
  } catch (error) {
    next(error); // Pass to centralized error handler
  }
});

// GET /api/sensors?limit=10 → Get last N readings
router.get("/", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const readings = await SensorReading.find()
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({ success: true, data: readings });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/sensors → Delete all readings (for testing)
router.delete("/", async (req, res, next) => {
  console.log("🗑️ DELETE request received at /api/sensors");
  try {
    await SensorReading.deleteMany({});
    res.json({
      success: true,
      message: "All sensor readings deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/sensors/history?limit=50
router.get("/history", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const readings = await SensorReading.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    res.json({ success: true, data: readings.reverse() });
  } catch (error) {
    console.error("Error fetching sensor history:", error);
    next(error);
  }
});

export default router;
