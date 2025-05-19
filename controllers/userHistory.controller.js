import { models } from "../models/index.js";
const { UserHistory } = models;

export const addUserHistory = async (req, res) => {
  try {
    let { video_id } = req.body;
    let { user_id } = req.user;
    const historyRowExists = await UserHistory.findOne({
      where: { video_id, user_id },
    });

    if (!historyRowExists) {
      // Create a new row
      await UserHistory.create({
        video_id,
        user_id,
      });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Video added to user history successfully",
      });
  } catch (error) {
    console.error("Error creating user:", error);
    // Send 500 status for other unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getUserHistory = async (req, res) => {
  try {
    let { user_id } = req.user;
    const userHistory = await UserHistory.findAll({
      where: { user_id },
    });
    if (!userHistory) {
      return res.status(200).json({
        success: false,
        message: "This list has no videos",
      });
    }
    return res.status(200).json({
      success: true,
      message: `${userHistory.length} vidoes found`,
      data: userHistory,
    });
  } catch (error) {
    console.error("Error fetching user history videos:", error);
    // Send 500 status for other unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
