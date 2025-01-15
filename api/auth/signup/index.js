import User from "../../../models/models.js";
import { connectToDatabase } from "../../../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const allowedOrigins = [
  "https://personal-finance-app-nu.vercel.app",
  "https://personal-finance-app-git-main-goodmistakes-projects.vercel.app",
  "https://personal-finance-axn5n3ht9-goodmistakes-projects.vercel.app",
];

const setCorsHeaders = (res, origin) => {
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS, GET, PUT, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
};

export default async function handler(req, res) {
  await connectToDatabase();

  const { method, headers } = req;
  const origin = headers.origin;

  setCorsHeaders(res, origin);

  if (method === "OPTIONS") {
    return res.status(200).end();
  }

  if (method === "POST") {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      });

      const refreshToken = jwt.sign(
        { id: newUser._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      newUser.refreshToken = refreshToken;
      await newUser.save();

      return res.status(201).json({
        message: "User registered successfully",
        token,
        refreshToken,
      });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
