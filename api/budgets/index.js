import { connectToDatabase } from "../../db.js";
import Budget from "../../models/budgets.js";
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

      const budgets = await Budget.find({ user: userId });
      return res.status(200).json(budgets);
    }

    if (method === "POST") {
      const { category, maximum, theme } = req.body;

      if (!category || maximum === undefined || maximum === null) {
        return res.status(400).json({ message: "Invalid input data" });
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const newBudget = new Budget({
        category,
        maximum,
        theme: theme || "#FFFFFF",
        user: new mongoose.Types.ObjectId(userId),
      });

      const savedBudget = await newBudget.save();
      return res.status(201).json(savedBudget);
    }

    if (method === "PUT") {
      const { id, category, maxAmount, themeColor } = req.body;

      if (!id || !category || maxAmount === undefined || !themeColor) {
        return res.status(400).json({
          message: "ID, category, maxAmount, and themeColor are required.",
        });
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const budget = await Budget.findById(id);
      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }

      if (!budget.user.equals(userId)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      budget.category = category;
      budget.maxAmount = maxAmount;
      budget.themeColor = themeColor;

      const updatedBudget = await budget.save();
      return res.status(200).json(updatedBudget);
    }

    if (method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ message: "ID is required for deletion." });
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const budget = await Budget.findById(id);
      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }

      if (!budget.user.equals(userId)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await budget.deleteOne();
      return res.status(200).json({ message: "Budget deleted successfully." });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE", "OPTIONS"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error(`[${req.method}] Error handling budgets:`, error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}
