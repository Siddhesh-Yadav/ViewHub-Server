// Import necessary modules
import dotenv from "dotenv"; // Module for loading environment variables from .env file
import express from "express"; // Express framework for building web applications
import cors from "cors"; // CORS middleware for enabling Cross-Origin Resource Sharing



// Import routes from the index.js file inside the routes folder
import routes from './routes/index.js';

// Load environment variables from .env file into process.env
dotenv.config();

// Create an instance of Express
const app = express();


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

app.use(errorLogger)

// Define the PORT and ENVIRONMENT variables for the server
const PORT = process.env.Workspace_DB_PORT; // Port number from environment variables

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  // cron.schedule("0 * * * *", async () => {
    // sendCollectionRequest();
  //   console.log("cron function called");
  // });
});


// Middleware function to log incoming requests
function requestLogger(req, res, next) {
  console.log(`[${new Date().toISOString()}]  ${req.method}  ${req.url}  \n${JSON.stringify(req.body).replace(",","\n")}`);
  next();
}

// Middleware function to log errors
function errorLogger(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  next(err);
}

