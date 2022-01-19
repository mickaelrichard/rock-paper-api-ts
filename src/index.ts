import express from "express";
import authRoutes from "./routes/authRoutes";
import notFoundMiddleware from "./middleware/not-found";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();

//db
import connectDB from "./db/connect";

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use("/auth", authRoutes);

//not found
app.use(notFoundMiddleware);

//start server
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

start();
