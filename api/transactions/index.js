import Transaction from "../../models/transaction.js";
import { connectToDatabase } from "../../db.js";

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
    "Content-Type, Authorization, X-Requested-With"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { method } = req;

  try {
    if (method === "GET") {
      const transactions = await Transaction.find();
      return res.status(200).json(transactions);
    }

    if (method === "POST") {
      const { amount, category, name, date, recurring, theme } = req.body;

      if (amount === undefined || !category) {
        return res
          .status(400)
          .json({ message: "Amount and category are required" });
      }

      const newTransaction = new Transaction({
        amount,
        category,
        name,
        date,
        recurring,
        theme,
      });

      await newTransaction.save();

      return res.status(201).json(newTransaction);
    }

    if (method === "PUT") {
      const { id, ...updateFields } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ message: "Transaction ID is required for updating" });
      }

      const updatedTransaction = await Transaction.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true }
      );

      if (!updatedTransaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      return res.status(200).json(updatedTransaction);
    }

    if (method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ message: "Transaction ID is required for deletion" });
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
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
