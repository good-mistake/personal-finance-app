import Transaction from "../../models/transaction.js";
import { connectToDatabase } from "../../db.js";
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

  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  const { method } = req;
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid pot ID" });
  }

  try {
    if (method === "GET") {
      const pot = await Transaction.findById(id);

      if (!pot) {
        return res.status(404).json({ message: "Pot not found" });
      }

      return res.status(200).json(pot);
    }

    if (method === "PUT") {
      const { total } = req.body;

      if (typeof total !== "number") {
        return res.status(400).json({ message: "Total must be a number" });
      }

      const updatedPot = await Transaction.findByIdAndUpdate(
        id,
        { total },
        { new: true, runValidators: true }
      );

      if (!updatedPot) {
        return res.status(404).json({ message: "Pot not found" });
      }

      return res.status(200).json(updatedPot);
    }

    if (method === "DELETE") {
      const deletedPot = await Transaction.findByIdAndDelete(id);

      if (!deletedPot) {
        return res.status(404).json({ message: "Pot not found" });
      }

      return res.status(200).json({ message: "Pot deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Error handling pot:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
