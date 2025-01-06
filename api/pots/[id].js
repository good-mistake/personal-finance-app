import Pot from "../../../models/Pot";
import { connectToDatabase } from "../../../db.js";

export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;
  const { id } = req.query;

  try {
    if (method === "GET") {
      const pot = await Pot.findById(id);
      if (!pot) return res.status(404).json({ message: "Pot not found" });
      return res.status(200).json(pot);
    }

    if (method === "PUT") {
      const { name, targetAmount } = req.body;
      const updatedPot = await Pot.findByIdAndUpdate(
        id,
        { name, targetAmount },
        { new: true }
      );
      if (!updatedPot)
        return res.status(404).json({ message: "Pot not found" });
      return res.status(200).json(updatedPot);
    }

    if (method === "DELETE") {
      const deletedPot = await Pot.findByIdAndDelete(id);
      if (!deletedPot)
        return res.status(404).json({ message: "Pot not found" });
      return res.status(200).json({ message: "Pot deleted" });
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
