// Import necessary modules
import dotenv from "dotenv"; // Module for loading environment variables from .env file
import express from "express"; // Express framework for building web applications
import cors from "cors"; // CORS middleware for enabling Cross-Origin Resource Sharing

// Import routes from the index.js file inside the routes folder
import routes from "./routes/index.js";

import { createServer } from "http"; // Create HTTP server
import { Server } from "socket.io"; // Import Socket.IO

// Load environment variables from .env file into process.env
dotenv.config();

// Create an instance of Express
const app = express();

const httpServer = createServer(app); // Create HTTP server using Express app
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST"], // Allowed methods
  },
});

// Middleware to parse incoming JSON requests
app.use(express.json());

//Increasing size for request entity
app.use(express.json({ limit: "10mb", extended: true }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);

// CORS options for allowing all origins, enabling credentials, and handling preflight OPTIONS requests
const CORS_OPTIONS = {
  origin: "*", // Allow requests from any origin (replace with specific origins in production)
  credentials: true, // Allow sending cookies and authorization headers
  optionSuccessStatus: 200, // Respond with 200 status for successful preflight requests
};

// Enable CORS middleware with the specified options
app.use(cors(CORS_OPTIONS));

app.use(requestLogger);

// Mount routes defined in the routes/index.js file
app.use("/", routes);

app.use(errorLogger);

// Define the PORT and ENVIRONMENT variables for the server
const PORT = process.env.PORT; // Port number from environment variables

// Set up Socket.IO for video sync and chat
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on("send-message", ({ roomId, message }) => {
    console.log(`User ${socket.id} sent message ${message} in room: ${roomId}`);
    io.to(roomId).emit("receive-message", message);
  });

  socket.on("video-action", ({ roomId, action, timestamp }) => {
    console.log(`User ${socket.id} performed action: ${action} at ${timestamp} in room: ${roomId}`);
    // Broadcast to all other users in the room
    io.to(roomId).emit("video-action", { action, timestamp });
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room: ${roomId}`);
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((room) => {
      if (room !== socket.id) {
        io.to(room).emit("user-disconnected", socket.id);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Middleware function to log incoming requests
function requestLogger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}]  ${req.method}  ${
      req.url
    }  \n${JSON.stringify(req.body).replace(",", "\n")}`
  );
  next();
}

// Middleware function to log errors
function errorLogger(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  next(err);
}
