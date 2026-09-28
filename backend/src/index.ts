import express from "express";
import "dotenv/config";
import router from "./routes/taskRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import authRouter from "./routes/authRoutes.js";
import cors from "cors";

const app = express();
const port = Number(process.env.PORT || 3000);
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}
if (!Number.isInteger(port) || port <= 0) {
  throw new Error("PORT must be a valid positive integer");
}
app.use(
  cors({
    origin: frontendUrl,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/tasks", router);
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
