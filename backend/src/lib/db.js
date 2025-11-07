import mongoose from "mongoose";
import {ENV} from "./env.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.DB_URL)
    console.log("Connected to DB:",conn.connection.host);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the process with failure
    // 0 means success and 1 means failure
  }
};