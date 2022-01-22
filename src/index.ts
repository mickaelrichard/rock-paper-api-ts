import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import notFoundMiddleware from "./middleware/not-found";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

//security mdlw => cannot import packages using import :/
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

//init
dotenv.config();
const app = express();

//db
import connectDB from "./db/connect";

//middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

//routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);

//not found
app.use(notFoundMiddleware);

// server
const port = process.env.PORT || 8080;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

//start server
start();
