import { DataTypes, NOW  } from "sequelize";
import { connection } from "../config/db.js";

export const Notification = connection.define(
  "notification",
  {
    notification_id :{
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },
    recipent_id: {
        type: DataTypes.INTEGER(10),
        allowNull : false
    },
    notification_type:{
        type: DataTypes.ENUM,
        values: ['friend_request', 'video_invite'],
    },
    associated_video_id :{
      type: DataTypes.STRING(30),
    },
    associated_user_id: {
        type: DataTypes.INTEGER(10),
    },
    notification_status:{
        type: DataTypes.ENUM,
        values: ['read', 'unread'],
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
  }
);



