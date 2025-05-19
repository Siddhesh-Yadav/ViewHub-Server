import { models } from "../models/index.js";
const { User } = models;

export const signup = async (req, res) => {
  try {
    let {
        full_name,
        email,
        user_name,
        password,
        profile_picture
      } = req.body;
      const emailExists = await User.findOne({
        raw: true,
        where: { email: email },
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Account with this email already exists",
        });
      };
      const userNameExists = await User.findOne({
        raw: true,
        where: { user_name: user_name },
      });
      if (userNameExists) {
        return res.status(400).json({
          success: false,
          message: "Account with this user name already exists",
        });
      };

      await User.create({
        full_name,
        email,
        user_name,
        password,
        profile_picture
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
