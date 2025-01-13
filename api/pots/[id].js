import Pot from "../../models/Pot.js";
import { connectToDatabase } from "../../db.js";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;
  const { id } = req.query;

  // Set CORS headers
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://personal-finance-app-nu.vercel.app" // Frontend domain
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (method === "OPTIONS") {
    return res.status(200).end();
  }

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid pot ID" });
  }

  try {
    switch (method) {
      case "GET": {
        const pot = await Pot.findById(id);

        if (!pot) {
          return res.status(404).json({ message: "Pot not found" });
        }

        return res.status(200).json(pot);
      }

      case "PUT": {
        const { total, ...rest } = req.body;

        if (total !== undefined && typeof total !== "number") {
          return res.status(400).json({ message: "Total must be a number" });
        }

        const updateData =
          total !== undefined ? { total, ...rest } : { ...rest };
        const updatedPot = await Pot.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        });

        if (!updatedPot) {
          return res.status(404).json({ message: "Pot not found" });
        }

        return res.status(200).json(updatedPot);
      }

      case "DELETE": {
        const deletedPot = await Pot.findByIdAndDelete(id);

        if (!deletedPot) {
          return res.status(404).json({ message: "Pot not found" });
        }

        return res.status(200).json({ message: "Pot deleted successfully" });
      }

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE", "OPTIONS"]);
        return res
          .status(405)
          .json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error(`[${method}] Error handling pot (ID: ${id}):`, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
