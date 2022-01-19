import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import notFoundMiddleware from "./middleware/not-found";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());

//db
import connectDB from "./db/connect";

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);

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
