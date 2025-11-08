import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
});

socket.on("sensor:update", (data) => {
  console.log("📡 Live sensor data:", data);
});

socket.on("disconnect", () => {
  console.log("🔴 Disconnected from server");
});
