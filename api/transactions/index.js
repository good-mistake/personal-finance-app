import { connectToDatabase } from "../../db.js";
import User from "../../models/models.js";
import Transaction from "../../models/transaction.js";
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
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
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

      const newTransaction = new Transaction({
        name,
        amount,
        category,
        date,
        recurring,
        theme,
        user: user._id,
      });

      const savedTransaction = await newTransaction.save();
      user.transactions.push(savedTransaction._id);
      await user.save();

      return res.status(201).json(savedTransaction);
    }

    if (method === "PUT") {
      const { transactionId, ...fieldsToUpdate } = req.body;

      if (!transactionId) {
        return res.status(400).json({ message: "Transaction ID is required" });
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      try {
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

        if (!transaction.user.equals(user._id)) {
          return res.status(403).json({ message: "Forbidden" });
        }

        Object.keys(fieldsToUpdate).forEach((field) => {
          if (fieldsToUpdate[field] !== undefined) {
            transaction[field] = fieldsToUpdate[field];
          }
        });

        const updatedTransaction = await transaction.save();

        return res.status(200).json(updatedTransaction);
      } catch (error) {
        console.error("Error updating transaction:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    if (method === "DELETE") {
      try {
        const { transactionId } = req.body;

        if (!transactionId) {
          return res
            .status(400)
            .json({ message: "Transaction ID is required" });
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

        if (!transaction.user.equals(user._id)) {
          return res.status(403).json({ message: "Forbidden" });
        }

        // Remove transaction ID from user's list and delete transaction
        user.transactions.pull(transactionId);
        await user.save();
        await transaction.deleteOne();

        return res
          .status(200)
          .json({ message: "Transaction deleted successfully" });
      } catch (error) {
        console.error("Error deleting transaction:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Unhandled error:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}
