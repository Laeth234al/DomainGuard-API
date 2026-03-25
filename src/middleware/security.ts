import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import config from "../config";

export function applySecurity(app: any) {
  //
  app.use(helmet());
  //
  app.use(
    cors({
      origin: config.CORS_ORIGIN || "*",
    })
  );
  //
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 min
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: "Too many requests from this IP",
    })
  );
}
