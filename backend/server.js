// ---------------------------------------------
// 🧠 Importing Required Modules
// ---------------------------------------------

// Express: A minimal web framework for Node.js
// It allows us to easily create APIs, handle routes, and manage HTTP requests.
import express from "express";

// CORS (Cross-Origin Resource Sharing):
// Enables your backend to accept requests from a frontend hosted on another domain or port
// (like your Vue.js app running on http://localhost:5173).
import cors from "cors";

// Dotenv: Loads environment variables from a .env file into process.env
// This helps us manage sensitive data (like database URLs, API keys, ports, etc.)
import dotenv from "dotenv";

// ---------------------------------------------
// ⚙️ Environment Configuration
// ---------------------------------------------

// Load environment variables defined in .env file (e.g., PORT=5000)
dotenv.config();

// Create an instance of the Express application
// This 'app' object represents your server.
const app = express();

// ---------------------------------------------
// 🧩 Middleware Setup
// ---------------------------------------------

// Middleware = functions that process incoming requests *before* they reach your routes.

// Enable CORS for all routes
// Without this, your frontend (on a different port) would be blocked by the browser.
app.use(cors());

// Enable JSON body parsing
// Express by default doesn’t understand JSON in requests. This line allows it to read JSON data.
app.use(express.json());

// ---------------------------------------------
// 🧪 Health Check Route
// ---------------------------------------------

// A “route” is simply an endpoint (like an API URL).
// This route is used to check if the server is running correctly.
// When you open http://localhost:5000/api/health, it will respond with a simple JSON message.
app.get("/api/health", (req, res) => {
  // 'req' = incoming request (from client)
  // 'res' = response object (used to send data back)
  res.json({ message: "Server is running" });
});

// ---------------------------------------------
// 🚀 Start the Server
// ---------------------------------------------

// Define which port the server will listen on.
// If the .env file has a PORT variable, use that — otherwise, default to 5000.
const PORT = process.env.PORT || 5000;

// app.listen() tells Express to start the HTTP server.
// Once it starts, it will wait for incoming requests from clients.
app.listen(PORT, () => {
  // This callback runs once the server successfully starts.
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
