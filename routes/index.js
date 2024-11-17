import express from "express";
const router = express.Router();

import { verifyAndDecrypt } from "../middlewares/authentication.middleware.js";

const ENVIRONMENT = process.env.Workspace; // Environment name from environment variables

// Define a route for the root endpoint to indicate that the server is running
router.get("/", async (req, res) => {
  return res.status(200).json(`${ENVIRONMENT} server running!`);
});

export default router;