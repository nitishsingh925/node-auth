import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

// Fallback route
app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

export { app };
