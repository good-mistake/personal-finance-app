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
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Temporary wildcard for testing
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Handle preflight request
  }

  if (req.method === "GET") {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user and populate related data
      const user = await User.findById(decoded.id)
        .select("-password") // Exclude password field
        .populate("transactions")
        .populate("budgets")
        .populate("pots");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        valid: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          balance: user.balance,
          transactions: user.transactions || [],
          budgets: user.budgets || [],
          pots: user.pots || [],
        },
      });
    } catch (error) {
      console.error("Error verifying token:", error.message);
      return res.status(401).json({ message: "Token is invalid or expired" });
    }
  }

  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
