import { models } from "../models/index.js";
const { FavouriteVideo } = models;

export const addFavouriteVideo = async (req, res) => {
  try {
    let { video_id,title } = req.body;
    let { user_id } = req.user;
    const favouriteVideoRowExists = await FavouriteVideo.findOne({
      where: { video_id, user_id },
    });

    if (!favouriteVideoRowExists) {
      // Create a new row
      await FavouriteVideo.create({
        video_id,
        user_id,
        video_title: title,
      });
    } 

    return res.status(200).json({
      success: true,
      message: "Video added to favourite successfully",
    });
  } catch (error) {
    console.error("Error adding favourites:", error);
    // Send 500 status for other unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const isFavouriteVideo = async (req, res) => {
  try {
    let { video_id } = req.params;
    let { user_id } = req.user;
    const favouriteVideoRowExists = await FavouriteVideo.findOne({
      where: { video_id, user_id },
    });

    if (favouriteVideoRowExists) {
      return res.status(200).json({
        success: true,
        message: "is favourite video",
      });
    }else {
      return res.status(200).json({
        success: false,
        message: "is not favourite video",
      });
    }
  } catch (error) {
    console.error("Error finding favourites:", error);
    // Send 500 status for other unexpected errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const favouriteVideos = async (req, res) => {
  try {
    const { user_id } = req.user;
    const favorites = await FavouriteVideo.findAll({
      where: { user_id },
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      message: `${favorites.length} favorite videos found`,
      data: favorites,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
