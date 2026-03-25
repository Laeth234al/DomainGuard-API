import app from "./app";
import { connectDB, disconnectDB } from "./config/database";
import { initDetector } from "./core/detector.instance";
import config from "./config";
import { logger } from "./lib/winston";

async function start() {
  //
  await connectDB();
  //
  await initDetector();
  //
  app.listen(config.PORT, () => {
    logger.info(`Server Running on ${config.PORT}`);
  });
}

start();
