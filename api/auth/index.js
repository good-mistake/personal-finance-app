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

  const { method, url } = req;

  if (method === "POST" && url === "/api/auth/signup") {
    const { username, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      return res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (method === "POST" && url === "/api/auth/login") {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (method === "GET" && url === "/api/auth/verify") {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({ valid: true, userId: decoded.id });
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: "Token is invalid or expired" });
    }
  }

  if (method === "POST" && url === "/api/auth/refresh") {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(403).json({ message: "No token provided" });

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({ token: newToken });
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: "Token is invalid or expired" });
    }
  }

  // Method not allowed
  res.setHeader("Allow", ["POST", "GET"]);
  return res.status(405).json({ message: `Method ${method} not allowed` });
}
