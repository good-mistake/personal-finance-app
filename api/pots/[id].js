import Pot from "../../models/Pot.js";
import { connectToDatabase } from "../../db.js";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;
  const { id } = req.query;

  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://personal-finance-app-nu.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (method === "OPTIONS") {
    return res.status(200).end();
  }

  // ID validation
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid pot ID" });
  }

  try {
    switch (method) {
      case "GET": {
        // Handle GET request for single pot
        const pot = await Pot.findById(id);

        if (!pot) {
          return res.status(404).json({ message: "Pot not found" });
        }

        return res.status(200).json(pot);
      }

      case "POST": {
        const { name, target, total, theme } = req.body;

        if (
          !name ||
          typeof target !== "number" ||
          typeof total !== "number" ||
          !theme
        ) {
          return res.status(400).json({ message: "Invalid pot data" });
        }

        const newPot = new Pot({ name, target, total, theme });
        await newPot.save();

        return res.status(201).json(newPot);
      }

      case "PUT": {
        const { name, target, total } = req.body;

        if (
          !id ||
          !name ||
          typeof target !== "number" ||
          typeof total !== "number"
        ) {
          return res.status(400).json({ message: "Invalid data for update" });
        }

        const updatedPot = await Pot.findByIdAndUpdate(
          id,
          { name, target, total },
          { new: true, runValidators: true }
        );

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
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE", "OPTIONS"]);
        return res
          .status(405)
          .json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error(`[${method}] Error handling pot (ID: ${id}):`, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
