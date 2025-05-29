import { models } from "../models/index.js";
import bcrypt from "bcrypt";
const { User } = models;

export const signup = async (req, res) => {
  try {
    let { full_name, email, user_name, password, profile_picture } = req.body;

    // Validate if password exists
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const emailExists = await User.findOne({
      raw: true,
      where: { email: email },
    });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Account with this email already exists",
      });
    }
    const userNameExists = await User.findOne({
      raw: true,
      where: { user_name: user_name },
    });
    if (userNameExists) {
      return res.status(400).json({
        success: false,
        message: "Account with this user name already exists",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({
      full_name,
      email,
      user_name,
      password: hashedPassword,
      profile_picture,
    });
    return res
      .status(200)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    // Send 500 status for other unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
