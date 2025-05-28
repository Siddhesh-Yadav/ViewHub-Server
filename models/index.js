import { FavouriteVideo } from "./FavouriteVideo.model.js";
import { Friends } from "./Friends.model.js";
import { Notification } from "./Notification.model.js";
import { User } from "./User.model.js";
import { UserHistory } from "./UserHistory.model.js";

//Dictates whether tables are modified or not;
const flag = false; // !! KEEP IT FALSE I REPEAT KEEP IT FALSE

// Export all imported models as a single object
export const models = {
  FavouriteVideo,
  Friends,
  Notification,
  User,
  UserHistory,
};

const flag2 = false; //! ARE YOU SURE?
const syncAllTables = async (models) => {
  if (flag) {
    try {
      for (const [modelName, model] of Object.entries(models)) {
        await model.sync({ alter: flag2 });
        console.log(`Table ${modelName} synchronized successfully!`);
      }
      console.log("Models altered and synchronized!");
    } catch (error) {
      console.error("Unable to synchronize tables:", error);
    }
  }
};

syncAllTables(models);
