import mongoose from "mongoose";
import Pot from "../../models/Pot.js";
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

  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { method } = req;
  const { id } = req.query;

  // Validate MongoDB ObjectId
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Pot ID" });
  }

  try {
    if (method === "GET") {
      const pot = await Pot.findById(id);
      if (!pot) {
        return res.status(404).json({ message: "Pot not found" });
      }
      return res.status(200).json(pot);
    }

    if (method === "PUT") {
      const { amount } = req.body;

      if (amount === undefined) {
        return res.status(400).json({ message: "Amount is required" });
      }

      const updatedPot = await Pot.findByIdAndUpdate(
        id,
        { $inc: { amount } }, // Increment the pot's amount
        { new: true, runValidators: true }
      );

      if (!updatedPot) {
        return res.status(404).json({ message: "Pot not found" });
      }

      return res.status(200).json(updatedPot);
    }

    if (method === "DELETE") {
      const deletedPot = await Pot.findByIdAndDelete(id);
      if (!deletedPot) {
        return res.status(404).json({ message: "Pot not found" });
      }
      return res.status(200).json({ message: "Pot deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
