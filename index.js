import express from "express";
import errorMiddleware from "./middlewares/Error.js";
import { connectDb } from "./db/connectDb.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.json({ limit: "600kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

config({
  path: "./.env",
});

connectDb();
app.get("/", (req, res) => {
  res.json({ message: "is working" });
});

app.listen(500, (req, res) => {
  console.log("server is workig port 500");
});

import userRouter from "./routes/user.js";
app.use("/users", userRouter);

import resRouter from "./routes/restaurant.js";
app.use("/restaurant", resRouter);

import orderRoute from "./routes/order.js";
app.use("/order", orderRoute);

app.use(errorMiddleware);
