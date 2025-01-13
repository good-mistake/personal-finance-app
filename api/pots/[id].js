import Pot from "../../models/Pot.js";
import { connectToDatabase } from "../../db.js";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid pot ID" });
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
      const { target, total } = req.body;

      if (target === undefined || total === undefined) {
        return res
          .status(400)
          .json({ message: "Target and total are required" });
      }

      const updatedPot = await Pot.findByIdAndUpdate(
        id,
        { target, total },
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
      return res.status(200).json({ message: "Pot deleted" });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Error handling pots:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
