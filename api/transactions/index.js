import Transaction from "../../models/transaction.js";
import { connectToDatabase } from "../../db.js";

export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;

  try {
    if (method === "GET") {
      const transactions = await Transaction.find();
      return res.status(200).json(transactions);
    }

    if (method === "POST") {
      const { amount, category } = req.body;

      if (amount === undefined || !category) {
        return res
          .status(400)
          .json({ message: "Amount and category are required" });
      }

      const newTransaction = new Transaction({ amount, category });
      await newTransaction.save();

      return res.status(201).json(newTransaction);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
