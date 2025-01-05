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

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { method } = req;

  if (method === "POST" && req.url.includes("/signup")) {
    const { username, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      return res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  } else if (method === "POST" && req.url.includes("/login")) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      });

      return res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  } else if (method === "POST" && req.url.includes("/verify")) {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({ valid: true, userId: decoded.id });
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: "Token is invalid or expired" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
