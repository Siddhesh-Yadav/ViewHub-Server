import fetch from "node-fetch";
import { models } from "../models/index.js";
const {Notification, User} = models;

export const getVideos = async (req, res) => {
  try {
    const YOUTUBE_API =
      "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=IN&key=AIzaSyBBdohHZqhRE92GaYWeMk7wH3rOK-MawLc";

    const response = await fetch(YOUTUBE_API, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const videos = await response.json();
    return res.status(200).json({
      success: true,
      message: `${videos.length} vidoes found`,
      data: videos,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    // Send 500 status for other unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const sendVideoInvite = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { user_name, video_id } = req.body;
    
    const userFound = await User.findOne({
      attributes: ["full_name", "user_name", "profile_picture", "user_id"],
      where: { user_name },
    });

    if (!userFound) {
      return res.status(400).json({
        success: false,
        message: `No user found with user name ${user_name}`,
      });
    }

    const room_id = `${user_id}_${userFound.user_id}_${video_id}`;
    
    const createNotification = await Notification.create({
      recipent_id: userFound.user_id,
      notification_type: "video_invite",
      associated_video_id: video_id,
      associated_user_id: user_id,
      notification_status: "unread",
      invite_status: "pending",
      room_id
    });

    return res.status(200).json({
      success: true,
      message: "Video invite sent!",
      room_id
    });
  } catch (error) {
    console.error("Error sending video invite:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
