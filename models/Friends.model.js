import { DataTypes, NOW  } from "sequelize";
import { connection } from "../config/db.js";

export const Friends = connection.define(
  "friends",
  {
    request_id :{
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },
    sender_id: {
        type: DataTypes.INTEGER(10),
        allowNull : false
    },
    recipent_id: {
        type: DataTypes.INTEGER(10),
        allowNull : false
    },
    request_status:{
        type: DataTypes.ENUM,
        values: ['accepted', 'pending', 'rejected'],
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
  }
);



