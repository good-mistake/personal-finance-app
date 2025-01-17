import { connectToDatabase } from "../../db.js";
import User from "../../models/models.js";
import Transaction from "../../models/transaction.js";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // Connect to the database
  await connectToDatabase();

  // Define allowed origins for CORS
  const allowedOrigins = [
    "https://personal-finance-app-nu.vercel.app",
    "https://personal-finance-app-git-main-goodmistakes-projects.vercel.app",
    "https://personal-finance-axn5n3ht9-goodmistakes-projects.vercel.app",
  ];

  const origin = req.headers.origin;

  // Set CORS headers
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight (OPTIONS) requests
  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Terminate preflight requests successfully
  }

  try {
    const { method } = req;

    if (method === "GET") {
      // Handle GET requests
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
      // Handle POST requests
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

      const newTransaction = new Transaction({
        name,
        amount,
        category,
        date,
        recurring,
        theme,
        user: user._id,
      });

      await newTransaction.save();

      user.transactions.push(newTransaction._id);
      await user.save();

      return res.status(201).json({
        message: "Transaction saved successfully",
        transaction: newTransaction,
      });
    }

    if (method === "PUT") {
      // Handle PUT requests
      const { transactionId, name, amount, category, date, recurring, theme } =
        req.body;

      if (!transactionId) {
        return res.status(400).json({ message: "Transaction ID is required" });
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

      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      transaction.name = name || transaction.name;
      transaction.amount = amount || transaction.amount;
      transaction.category = category || transaction.category;
      transaction.date = date || transaction.date;
      transaction.recurring =
        recurring !== undefined ? recurring : transaction.recurring;
      transaction.theme = theme || transaction.theme;

      await transaction.save();

      return res
        .status(200)
        .json({ message: "Transaction updated successfully", transaction });
    }

    if (method === "DELETE") {
      // Handle DELETE requests
      const { transactionId } = req.body;

      if (!transactionId) {
        return res.status(400).json({ message: "Transaction ID is required" });
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

      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      user.transactions.pull(transactionId);
      await user.save();

      await transaction.remove();

      return res
        .status(200)
        .json({ message: "Transaction deleted successfully" });
    }

    // If method not allowed
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Unhandled error:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}
