import Transaction from "../../models/transaction.js";
import { connectToDatabase } from "../../db.js";
import User from "../../models/models.js";
import { authenticateToken } from "../../src/utils/middleware.js";

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
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "OPTIONS") {
    try {
      console.log("Authenticating token...");
      await authenticateToken(req, res);
    } catch (error) {
      console.error("Authentication failed:", error);
      return res.status(401).json({ message: "Authentication failed" });
    }
  }

  const { method, query, body } = req;
  console.log(req.headers.authorization);
  try {
    if (req.method === "GET") {
      console.log(req.headers.authorization);
      authenticateToken(req, res, async () => {
        try {
          const transactions = await Transaction.find({ user: req.user.id });
          res.status(200).json(transactions);
        } catch (error) {
          console.error("Error fetching transactions:", error);
          res.status(500).json({ message: "Error fetching transactions" });
        }
      });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }

    if (method === "POST") {
      const { name, amount, category, date, recurring, theme } = body;

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

      // Create a new transaction
      const newTransaction = { name, amount, category, date, recurring, theme };

      const userId = req.user.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.transactions.push(newTransaction);
      await user.save();

      return res.status(201).json(newTransaction);
    }

    if (method === "PUT") {
      const { id } = query;
      if (!id) {
        return res.status(400).json({ message: "Transaction ID is required" });
      }

      const updatedTransaction = await Transaction.findByIdAndUpdate(id, body, {
        new: true,
      });
      if (!updatedTransaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      return res.status(200).json(updatedTransaction);
    }

    if (method === "DELETE") {
      const { id } = query;
      if (!id) {
        return res.status(400).json({ message: "Transaction ID is required" });
      }

      const deletedTransaction = await Transaction.findByIdAndDelete(id);
      if (!deletedTransaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      return res
        .status(200)
        .json({ message: "Transaction deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Error handling transactions:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
