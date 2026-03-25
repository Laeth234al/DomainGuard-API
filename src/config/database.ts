import mongoose from "mongoose";
import config from ".";
import { logger } from "../lib/winston";

export async function connectDB() {
  try {
    //
    await mongoose.connect(config.MONGO_URL);
    //
    logger.info("DB connected");
    //
  } catch (err) {
    //
    logger.error(err);
    //
    process.exit(1);
  }
}

export async function disconnectDB() {
  try {
    //
    await mongoose.disconnect();
    //
    logger.info("DB disconnected");
    //
  } catch (err) {
    //
    logger.error(err);
    //
    process.exit(1);
  }
}
