import { DataTypes, NOW  } from "sequelize";
import { connection } from "../config/db.js";

export const UserHistory = connection.define(
  "user_history",
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
    }
  },
  {
    // Freeze Table Name
    freezeTableName: true,
  }
);



