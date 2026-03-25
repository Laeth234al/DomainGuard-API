import express from "express";
import authRoutes from "./modules/auth/user.routes";
import spamRoutes from "./modules/spam/spam.routes";
import tldRoutes from "./modules/tld/tld.routes";
import { applySecurity } from "./middleware/security";

const app = express();

app.use(express.json());

applySecurity(app);

app.use("/api/auth", authRoutes);
app.use("/api/spam", spamRoutes);
app.use("/api/tld", tldRoutes);

export default app;
