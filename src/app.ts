import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import materialsRoutes from "./routes/materialsRoutes";
import designsRoutes from "./routes/designsRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();
app.use(express.json()); // parse the req body with json data。Express v4.16.0 後，之前會用 body-parser library
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/api/auth/", authRoutes);
app.use("/api/materials/", materialsRoutes);
app.use("/api/designs/", designsRoutes);

// Add the error-handling middleware after all routes
app.use(errorMiddleware);

export default app;
