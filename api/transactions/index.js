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
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { method, query } = req;

  try {
    if (method === "GET") {
      const pots = await Transaction.find();
      return res.status(200).json(pots);
    }

    if (method === "POST") {
      const { amount, category, total } = req.body;

      if (!amount || !category || typeof total !== "number") {
        return res
          .status(400)
          .json({ message: "Amount, category, and total are required" });
      }

      const newPot = new Transaction({ amount, category, total });
      await newPot.save();
      return res.status(201).json(newPot);
    }

    if (method === "DELETE") {
      const { id } = query;

      if (!id) {
        return res.status(400).json({ message: "Pot ID is required" });
      }

      const deletedPot = await Transaction.findByIdAndDelete(id);

      if (!deletedPot) {
        return res.status(404).json({ message: "Pot not found" });
      }

      return res.status(200).json({ message: "Pot deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Error handling pots:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
