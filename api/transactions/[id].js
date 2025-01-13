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
      const { total } = req.body;

      if (typeof total !== "number") {
        return res.status(400).json({ message: "Total must be a number" });
      }

      const updatedPot = await Pot.findByIdAndUpdate(
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
      const deletedPot = await Pot.findByIdAndDelete(id);

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
