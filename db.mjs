import mongoose from "mongoose";

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  const uri =
    process.env.MONGO_URI ||
    "MONGO_URI=mongodb+srv://admin:5TTbUJAysMWcdzSn@cluster0.yv9sg.mongodb.net/personalFinanceApp?retryWrites=true&w=majority&appName=Cluster0";

  if (!uri) {
    throw new Error("MONGO_URI environment variable is required");
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectToDatabase;
