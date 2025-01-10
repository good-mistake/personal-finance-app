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

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
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
