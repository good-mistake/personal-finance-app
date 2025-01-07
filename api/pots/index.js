import Pot from "../../models/Pot.js";
import { connectToDatabase } from "../../db.js";

export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;

  try {
    switch (method) {
      case "GET": {
        const pots = await Pot.find();
        return res.status(200).json(pots);
      }

      case "POST": {
        const { name, targetAmount } = req.body;

        if (!name || !targetAmount) {
          return res
            .status(400)
            .json({ message: "Name and targetAmount are required." });
        }

        const newPot = new Pot({ name, targetAmount });
        await newPot.save();

        return res.status(201).json(newPot);
      }

      default: {
        res.setHeader("Allow", ["GET", "POST"]);
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
