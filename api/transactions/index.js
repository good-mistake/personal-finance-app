import { connectToDatabase } from "../../db.js";
import User from "../../models/models.js";
import Transaction from "../../models/Transaction.js";
import jwt from "jsonwebtoken";

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
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Access-Control-Allow-Origin"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { method } = req;

  try {
    if (method === "GET") {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      const user = await User.findById(userId).populate("transactions");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user.transactions);
    }

    if (method === "POST") {
      const { name, amount, category, date, recurring, theme } = req.body;

      if (
        !name ||
        !amount ||
        !category ||
        !date ||
        recurring === undefined ||
        !theme
      ) {
        return res.status(400).json({ message: "Missing required fields" });
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

      const newTransaction = await Transaction.create({
        name,
        amount,
        category,
        date,
        recurring,
        theme,
        user: user._id,
      });

      user.transactions.push(newTransaction._id);
      await user.save();

      return res.status(201).json({
        message: "Transaction saved successfully",
        transaction: newTransaction,
      });
    }

    if (method === "PUT") {
      const { id, name, amount, category, date, recurring, theme } = req.body;

      if (
        !id ||
        !name ||
        !amount ||
        !category ||
        !date ||
        recurring === undefined ||
        !theme
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const transaction = await Transaction.findOneAndUpdate(
        { _id: id, user: userId },
        { name, amount, category, date, recurring, theme },
        { new: true }
      );

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      return res.status(200).json({
        message: "Transaction updated successfully",
        transaction,
      });
    }

    if (method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: "Missing transaction ID" });
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const transaction = await Transaction.findOneAndDelete({
        _id: id,
        user: userId,
      });

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      await User.updateOne({ _id: userId }, { $pull: { transactions: id } });

      return res.status(200).json({
        message: "Transaction deleted successfully",
        transaction,
      });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Unhandled error:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}
