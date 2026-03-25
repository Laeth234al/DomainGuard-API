import winston from "winston";
import config from "../config";

const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

const transports: winston.transport[] = [];

if (config.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }), // add color to log level
        timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }), // Add timestamp to logs
        align(), // align log messages
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta)}`
            : "";
          //
          return `${timestamp} [${level}]: ${message} ${metaStr}`;
        })
      ),
    })
  );
}

const logger = winston.createLogger({
  level: config.LOG_LEVEL, // setting the default logging level to info
  format: combine(timestamp(), errors({ stack: true }), json()), // use JSON fromat for log
  transports,
  silent: config.NODE_ENV === "test", // Disable loggingin test environment
});

export { logger };
