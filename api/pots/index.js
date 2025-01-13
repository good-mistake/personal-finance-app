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
      const pots = await Pot.find();
      return res.status(200).json(pots);
    }

    if (method === "POST") {
      const { amount, category } = req.body;

      if (amount === undefined || !category) {
        return res
          .status(400)
          .json({ message: "Amount and category are required" });
      }

      const newPot = new Pot({ amount, category });
      await newPot.save();

      return res.status(201).json(newPot);
    }

    if (method === "PUT") {
      const { id, ...updateFields } = req.query; // Assuming you're passing the pot ID in the query

      if (!id) {
        return res
          .status(400)
          .json({ message: "Pot ID and amount are required" });
      }

      const pot = await Pot.findById(id);

      if (!pot) {
        return res.status(404).json({ message: "Pot not found" });
      }

      const updatedpots = await Pot.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true,
      });
      if (!updatedpots) {
        return res.status(404).json({ message: "Pot not found" });
      }
      return res.status(200).json(pot);
    }

    if (method === "DELETE") {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: "Pot ID is required" });
      }

      const pot = await Pot.findByIdAndDelete(id);

      if (!pot) {
        return res.status(404).json({ message: "Pot not found" });
      }

      return res.status(200).json({ message: "Pot deleted successfully" });
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
