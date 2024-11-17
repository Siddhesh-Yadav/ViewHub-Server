import Sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const connection = new Sequelize(
  process.env.Workspace_DB_RDS_NAME,
  process.env.Workspace_DB_RDS_USER,
  process.env.Workspace_DB_RDS_PASS,
  {
    host: process.env.Workspace_DB_RDS_HOST,
    dialect: process.env.Workspace_DB_DIALECT,
    dialectOptions: {
      timezone: "+05:30",
    },
    logging: false
  }
);
//Test Connection
connection
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });
