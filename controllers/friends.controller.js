import { Op } from "sequelize";
import { models } from "../models/index.js";
const { Friends, User, Notification } = models;

export const getFriends = async (req, res) => {
  try {
    let { user_id } = req.user;
    const allFriends = await Friends.findAll({
      raw: true,
      where: {
        [Op.or] :[{sender_id: user_id}, {recipent_id: user_id}],
        request_status: ["accepted", "pending"],
      },
    });
    console.log("All Friends:", allFriends);

    // Extract the user IDs of the senders and recipients from the friend requests
    const UserIds = allFriends.map((user) => {
      return user.sender_id === user_id ? user.recipent_id : user.sender_id;
    });
    
    // Retrieve the user details of the friends
    const friendsData = await User.findAll({
      raw:true,
      attributes: ["user_id","full_name", "user_name", "profile_picture"],
      where: {
        user_id: UserIds,
      },
    });

    const friends = allFriends.map((user) => {
      const friendId = user.sender_id === user_id ? user.recipent_id : user.sender_id;
      const friendDetails = friendsData.find((friend) => friend.user_id === friendId);
      return {
        ...friendDetails,
        ...user
      };
    });

    return res.status(200).json({
        success: true,
        message: `${friends.length} friends `,
        data: friends,
      });
  } catch (error) {
    console.error("Error fetching friends list:", error);
    // Send 500 status for other unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const friendRequestApproval = async (req, res) => {
  try {
    const { notification_id, approval, associated_user_id} = req. body;
    const { user_id } = req.user;
    const updateRequestStatus = await Friends.update(
      { request_status: approval ? "accepted" : "rejected" },
      { where: { recipent_id : user_id, sender_id : associated_user_id, request_status : "pending" } }
    );
    const updateNotificationStatus = await Notification.update(
      {notification_status: "read"},
      {where: {notification_id:notification_id}}
    )
    return res.status(200).json({
        success: true,
        message: `${updateRequestStatus.length>0?"request status updated successfully":"No such user exist!"}`,
      });
  } catch (error) {
    console.error("Error approving friend request:", error);
    // Send 500 status for other unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const sendFriendRequest = async ( req, res ) => {
  try{
    const {user_id} = req.user;
    const {user_name} = req.body;
    const userFound = await User.findOne({
      attributes: ["full_name", "user_name", "profile_picture","user_id"],
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
    const createNotification = await Notification.create({
      recipent_id : userFound.user_id,
      notification_type : "friend_request",
      associated_video_id : null,
      associated_user_id : user_id,
      notification_status : "unread",
    });
    const addFriend = await Friends.create({
      sender_id : user_id,
      recipent_id : userFound.user_id,
      request_status:"pending",
      notification_id : createNotification.notification_id,
    });
    return res.status(200).json({
      success: true,
      message: "Friend request sent!",
    });
    
  } catch (error) {
    console.error("Error approving friend request:", error);
    // Send 500 status for other unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
