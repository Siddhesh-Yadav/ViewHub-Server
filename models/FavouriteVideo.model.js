import { DataTypes, NOW  } from "sequelize";
import { connection } from "../config/db.js";

export const FavouriteVideo = connection.define(
  "favourite_video",
  {
    id :{
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },
    video_id :{
      type: DataTypes.STRING(30),
      allowNull : false
    },
    user_id: {
        type: DataTypes.INTEGER(10),
        allowNull : false
    },
    video_title: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: NOW,
      allowNull: false,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
  }
);



