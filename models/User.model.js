import { DataTypes, NOW  } from "sequelize";
import { connection } from "../../config/db.js";

export const user= connection.define(
  "users",
  {
    F_name: {
      type: DataTypes.STRING(30),
    },
    L_name: {
      type: DataTypes.STRING(30),
    },
    Email: {
      type: DataTypes.STRING(30),
    },
    Mobile_No: {
      type: DataTypes.STRING(15),
    },
    userName:{
      type:DataTypes.STRING(15),
    },
    Password: {
      type: DataTypes.STRING(15),
    },
    Status: {
      type: DataTypes.STRING(2),
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
  }
);



