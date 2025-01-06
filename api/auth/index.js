import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/models";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

export default async function handler(req, res) {
  await connectDB();

  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://personal-finance-app-nu.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { method } = req;

  if (method === "POST" && req.url.includes("/signup")) {
    const { name, email, password } = req.body; // Use 'name' instead of 'username'
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username: name,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      });

      return res
        .status(201)
        .json({ message: "User registered successfully", token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
