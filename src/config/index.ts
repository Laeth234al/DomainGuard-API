import dotenv from "dotenv";
import type ms from "ms";

dotenv.config({
  quiet: process.env.NODE_ENV === "test",
});

function normalizePort(port: string | undefined): number {
  if (port) {
    //
    let myPort = parseInt(port);
    //
    if (myPort < 0) myPort *= -1;
    //
    return myPort;
  }
  return 3000;
}

const config = {
  PORT: normalizePort(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV || "devlopment",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  MONGO_URL: process.env.MONGO_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_SECRET_EXPIRY: process.env.JWT_SECRET_EXPIRY! as ms.StringValue,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
};

export default config;
