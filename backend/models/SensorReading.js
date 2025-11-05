import mongoose from "mongoose";

// Define how a sensor reading document looks
const sensorReadingSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  temperature: { type: Number, required: true, min: -50, max: 150 },
  humidity: { type: Number, required: true, min: 0, max: 100 },
  timestamp: { type: Date, default: Date.now },
});

// Create a model (like a class for MongoDB documents)
const SensorReading = mongoose.model("SensorReading", sensorReadingSchema);

export default SensorReading;
