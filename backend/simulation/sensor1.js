import axios from "axios";

const API_URL = "http://localhost:5000/api/sensors";

function generateSensorData(deviceId) {
  return {
    deviceId,
    temperature: Math.floor(Math.random() * 30) + 15, // 15–44°C
    humidity: Math.floor(Math.random() * 50) + 30, // 30–79%
  };
}

async function sendSensorData(deviceId) {
  const data = generateSensorData(deviceId);
  try {
    const response = await axios.post(API_URL, data);
    console.log("Sent data:", data, "Status:", response.status);
  } catch (error) {
    console.error("Error sending data:", error.message);
  }
}

// Run every 5 seconds
const DEVICE_ID = "device-001";
setInterval(() => sendSensorData(DEVICE_ID), 5000);
