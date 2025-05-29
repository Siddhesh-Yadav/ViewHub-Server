import { models } from "../models/index.js";
const {Notification} = models;

export const getNotification = async ( req, res ) => {
  try {
    const {user_id } = req.user;
    const notifcations = await Notification.findAll({
        where:{recipent_id:user_id, notification_status:"unread"}
    });
    if(!notifcations){
        return res.status(200).json({
            success: false,
            message: `No notifications`,
          });
    };
    return res.status(200).json({
        success: true,
        message: `notifications found`,
        data: notifcations
      });
  } catch (error) {
    console.error("Error retrieving notification", error);
    // Send 500 status for other unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateNotification = async (req, res) => {
  try {
    const { notification_id } = req.body;
    const notification = await Notification.update(
      { notification_status: "read" },
      { where: { notification_id } }
    );
    
    return res.status(200).json({
      success: true,
      message: "Notification updated successfully",
    });
  } catch (error) {
    console.error("Error updating notification", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
