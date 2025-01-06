import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log("Reusing database connection");
    return;
  }

  try {
    const uri =
      process.env.MONGO_URI ||
      "mongodb+srv://admin:5TTbUJAysMWcdzSn@cluster0.yv9sg.mongodb.net/personalFinanceApp?retryWrites=true&w=majority&appName=Cluster0";
    if (!uri) throw new Error("MONGO_URI environment variable is required");

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error;
  }
};
