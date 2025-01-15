import jwt from "jsonwebtoken";
import { connectToDatabase } from "../../../db.js";
import User from "../../../models/models.js";

export default async function handler(req, res) {
  await connectToDatabase();

  const allowedOrigins = [
    "https://personal-finance-app-nu.vercel.app",
    "https://personal-finance-app-git-main-goodmistakes-projects.vercel.app",
    "https://personal-finance-axn5n3ht9-goodmistakes-projects.vercel.app",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(403)
          .json({ message: "Access denied, no token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        valid: true,
        transactions: user.transactions || [],
      });
    } catch (error) {
      console.error("Token validation error:", error);
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token has expired, please log in again" });
      }
      return res
        .status(403)
        .json({ message: "Token is invalid or access denied" });
    }
  }

  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
