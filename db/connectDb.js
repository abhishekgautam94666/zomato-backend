import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://abhishekgautam94666:ntDTcbyTxZvhLWNm@food-application.irbzlcy.mongodb.net/?retryWrites=true&w=majority&appName=food-application"
    );
    if (conn) {
      console.log("MongoDB connected...");
    } else {
      console.log("error for connecting database");
    }
  } catch (error) {
    console.log("error :", error.message);
  }
};
