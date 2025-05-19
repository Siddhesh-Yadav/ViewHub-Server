import { DataTypes, NOW  } from "sequelize";
import { connection } from "../config/db.js";

export const User = connection.define(
  "users",
  {
    user_id :{
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },
    full_name :{
      type: DataTypes.STRING(30),
      allowNull : false
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull :false,
      unique : true
    },
    user_name:{
      type:DataTypes.STRING(15),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(15),
    },
    profile_picture :{
      type: DataTypes.STRING(),
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
  }
);



