import express from "express";
import "dotenv/config";
import router from "./routes/taskRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import authRouter from "./routes/authRoutes.js"
import cors from "cors";

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/tasks",router);
app.use("/api/auth",authRouter);
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
