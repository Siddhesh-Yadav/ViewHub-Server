import { models } from "../models/index.js";
const { User } = models;

export const findUser = async (req, res) => {
  try {
    const { user_name } = req.body;
    const userFound = await User.findOne({
      attributes: ["full_name", "user_name", "profile_picture"],
      where: {
        user_name: user_name,
      },
    });
    if (!userFound) {
      return res.status(400).json({
        success: false,
        message: `No user found with user name ${user_name}`,
      });
    }
    return res.status(200).json({
      success: true,
      message: `user found !`,
      data: userFound,
    });
  } catch (error) {
    console.error("Error while fetching user details:", error);
    // Send 500 status for other unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
