import { models } from "../models/index.js";
const { User } = models;

import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const SECRET_KEY = process.env.SECRET_KEY;

const generateJWT = (payload) => {
  const payloadString = JSON.stringify(payload);

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY, "hex"),
    iv
  );
  let encryptedData = cipher.update(payloadString, "utf8", "base64");
  encryptedData += cipher.final("base64");

  // Create JWT token with encrypted payload
  const token = jwt.sign(
    { data: encryptedData, iv: iv.toString("base64") },
    JWT_SECRET
  );
  return token;
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({
      raw: true,
      where: { email, password },
    });

    // If user not found, return error
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Please try to login with correct credentials!",
      });
    }
    
    const {full_name,email :Email,user_name,profile_picture, user_id} = user
    // Generate JWT token
    const PAYLOAD = { user_id, user_name };
    let JWT = generateJWT(PAYLOAD);

    // Return successful response with user info, menus, and logo
    return res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      data: {
        JWT,
        full_name,
        email : Email,
        user_name,
        profile_picture,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    // Send 500 status for other unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
