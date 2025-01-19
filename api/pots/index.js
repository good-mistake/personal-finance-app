import { connectToDatabase } from "../../db.js";
import User from "../../models/models.js";
import Pot from "../../models/Pot.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { method } = req;

    if (method === "GET") {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const user = await User.findById(userId).populate("pots");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user.pots);
    }

    if (method === "POST") {
      const { name, target, theme } = req.body;

      if (!name || !theme || typeof target !== "number" || target <= 0) {
        return res.status(400).json({ message: "Invalid input data" });
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newPot = new Pot({
        name,
        target,
        total: 0,
        theme,
        user: new mongoose.Types.ObjectId(user._id),
      });
      const savedPot = await newPot.save();

      user.pots.push(savedPot._id);
      await user.save();

      return res.status(201).json(savedPot);
    }

    if (method === "PUT") {
      const { amount } = req.body;
      const potId = req.query.id;

      if (!amount || !potId) {
        return res
          .status(400)
          .json({ message: "Pot ID and amount are required" });
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const pot = await Pot.findById(potId);
      if (!pot) {
        return res.status(404).json({ message: "Pot not found" });
      }

      if (!pot.user.equals(userId)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Update the total amount by adding or subtracting from current total
      pot.total += amount;

      const updatedPot = await pot.save();

      return res.status(200).json(updatedPot);
    }

    if (method === "DELETE") {
      const { potId } = req.body;

      if (!potId) {
        return res.status(400).json({ message: "Pot ID is required" });
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const pot = await Pot.findById(potId);
      if (!pot) {
        return res.status(404).json({ message: "Pot not found" });
      }

      if (!pot.user.equals(user._id)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      user.pots = user.pots.filter((id) => !id.equals(potId));
      await user.save();
      await pot.deleteOne();

      return res.status(200).json({ message: "Pot deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE", "OPTIONS"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error(`[${req.method}] Error handling pots:`, error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}
