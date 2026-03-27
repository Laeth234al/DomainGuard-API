import express from "express";
import authRoutes from "./modules/auth/user.routes";
import spamRoutes from "./modules/spam/spam.routes";
import tldRoutes from "./modules/tld/tld.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { applySecurity } from "./middleware/security";

const app = express();

app.use(express.json());

applySecurity(app);

app.use("/api/auth", authRoutes);
app.use("/api/spam", spamRoutes);
app.use("/api/tld", tldRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
