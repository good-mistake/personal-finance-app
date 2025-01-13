import Pot from "../../models/Pot.js";
import { connectToDatabase } from "../../db.js";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectToDatabase();

  const { method, query, body } = req;
  const { id } = query;

  // Set CORS headers
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://personal-finance-app-nu.vercel.app"
  ); // Change to the frontend URL
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (method === "GET") {
      if (id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid pot ID" });
        }
        const pot = await Pot.findById(id);
        if (!pot) {
          return res.status(404).json({ message: "Pot not found" });
        }
        return res.status(200).json(pot);
      } else {
        const pots = await Pot.find({});
        return res.status(200).json(pots);
      }
    }

    if (method === "POST") {
      const { name, target, total } = body;

      if (!name || typeof target !== "number" || typeof total !== "number") {
        return res.status(400).json({ message: "Invalid pot data" });
      }

      const newPot = await Pot.create({ name, target, total });
      return res.status(201).json(newPot);
    }

    if (method === "PUT") {
      if (!id) {
        return res
          .status(400)
          .json({ message: "Pot ID is required for updates" });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid pot ID" });
      }

      const updatedPot = await Pot.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });

      if (!updatedPot) {
        return res.status(404).json({ message: "Pot not found" });
      }

      return res.status(200).json(updatedPot);
    }

    if (method === "DELETE") {
      if (!id) {
        return res
          .status(400)
          .json({ message: "Pot ID is required for deletion" });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid pot ID" });
      }

      const deletedPot = await Pot.findByIdAndDelete(id);

      if (!deletedPot) {
        return res.status(404).json({ message: "Pot not found" });
      }

      return res.status(200).json({ message: "Pot deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE", "OPTIONS"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Error handling pots:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
