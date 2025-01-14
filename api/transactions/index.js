import Transaction from "../../models/transaction.js";
import { connectToDatabase } from "../../db.js";

export default async function handler(req, res) {
  await connectToDatabase();

  const allowedOrigins = [
    "https://personal-finance-app-nu.vercel.app",
    "https://personal-finance-app-git-main-goodmistakes-projects.vercel.app",
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

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Preflight response for CORS
  }

  const { method, query, body } = req;

  try {
    if (method === "GET") {
      const { id } = query;

      if (id) {
        const transaction = await Transaction.findById(id);
        if (!transaction) {
          return res.status(404).json({ message: "Transaction not found" });
        }
        return res.status(200).json(transaction);
      }

      const transactions = await Transaction.find();
      return res.status(200).json(transactions);
    }

    if (method === "POST") {
      const { name, amount, category, date, recurring } = body;

      if (!name || !amount || !category || !date) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newTransaction = new Transaction({
        name,
        amount,
        category,
        date,
        recurring,
      });
      await newTransaction.save();
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
