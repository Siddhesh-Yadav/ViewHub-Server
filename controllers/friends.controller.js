import { models } from "../models/index.js";
const { Friends, User, Notification } = models;

export const getFriends = async (req, res) => {
  try {
    let { user_id } = req.user;
    const sentRequests = await Friends.findAll({
      where: {
        sender_id: user_id,
        request_status: "accepted",
      },
    });

    // Find all friend requests where the user is the recipient and the request status is 'accepted'
    const receivedRequests = await Friends.findAll({
      where: {
        recipent_id: user_id,
        request_status: "accepted",
      },
    });

    // Extract the user IDs of the senders and recipients from the friend requests
    const sentUserIds = sentRequests.map((request) => request.recipient_id);
    const receivedUserIds = receivedRequests.map(
      (request) => request.sender_id
    );

    // Combine the user IDs from both lists to get the IDs of all friends
    const friendUserIds = [...sentUserIds, ...receivedUserIds];

    // Retrieve the user details of the friends
    const friends = await User.findAll({
      attributes: ["full_name", "user_name", "profile_picture"],
      where: {
        user_id: friendUserIds,
      },
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
    const { approval, sender_user_name,notification_id } = req.body;
    const { user_id } = req.user;
    const sender = await User.findOne({
      where: { user_name: sender_user_name },
    });
    const updateRequestStatus = await Friends.update(
      { request_status: approval ? "accepted" : "rejected" },
      { where: { recipent_id: user_id, sender_id: sender.user_id,request_status : "pending" } }
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
    const addFriend = await Friends.create({
      sender_id : user_id,
      recipent_id : userFound.user_id,
      request_status:"pending"
    });
    const createNotification = await Notification.create({
      recipent_id:userFound.user_id,
      notification_type:"friend_request",
      associated_video_id:null,
      associated_user_id: user_id,
      notification_status:"unread"
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
