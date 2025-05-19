import { models } from "../models/index.js";
import { Op } from "sequelize";
const { User } = models;

export const findUser = async (req, res) => {
  try {
    const { search, user_ids } = req.query;
    const { user_id: currentUserId } = req.user;

    // If user_ids array is provided, fetch those specific users
    if (user_ids) {
      const userIdArray = JSON.parse(user_ids);
      const users = await User.findAll({
        attributes: ["user_id", "full_name", "user_name", "profile_picture"],
        where: {
          user_id: userIdArray
        }
      });
      
      return res.status(200).json({
        success: true,
        message: `${users.length} users found`,
        data: users,
      });
    }

    // Otherwise handle search query
    const users = await User.findAll({
      attributes: ["user_id", "full_name", "user_name", "profile_picture"],
      where: {
        [Op.or]: [
          { full_name: { [Op.like]: `%${search}%` } },
          { user_name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      },
      limit: 10, // Limit results for better performance
    });

    return res.status(200).json({
      success: true,
      message: `${users.length} users found`,
      data: users,
    });
  } catch (error) {
    console.error("Error while fetching user details:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
