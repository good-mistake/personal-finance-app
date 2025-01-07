import Pot from "../../models/Pot.js";
import { connectToDatabase } from "../../db.js";
export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;
  const { id } = req.query;

  try {
    switch (method) {
      case "GET": {
        const pot = await Pot.findById(id);
        if (!pot) return res.status(404).json({ message: "Pot not found" });
        return res.status(200).json(pot);
      }

      case "PUT": {
        const { name, targetAmount } = req.body;

        if (!name || !targetAmount) {
          return res
            .status(400)
            .json({ message: "Name and targetAmount are required." });
        }

        const updatedPot = await Pot.findByIdAndUpdate(
          id,
          { name, targetAmount },
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
        return res.status(200).json({ message: "Pot deleted successfully." });
      }

      default: {
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res
          .status(405)
          .json({ message: `Method ${method} Not Allowed` });
      }
    }
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
