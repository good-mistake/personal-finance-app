import Pot from "../../models/Pot.js";
import { connectToDatabase } from "../../db.js";

export default async function handler(req, res) {
  await connectToDatabase();

  const { method, body, query } = req;
  const allowedOrigins = [
    "https://personal-finance-app-nu.vercel.app",
    "https://personal-finance-app-git-main-goodmistakes-projects.vercel.app",
    "https://personal-finance-axn5n3ht9-goodmistakes-projects.vercel.app",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
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

  try {
    switch (method) {
      case "GET": {
        const pots = await Pot.find({});
        return res.status(200).json(pots);
      }

      case "POST": {
        try {
          const { name, target, theme } = body;

          if (!name || !theme || typeof target !== "number" || target <= 0) {
            return res.status(400).json({ message: "Invalid input data" });
          }

          const newPot = new Pot({ name, target, total: 0, theme });
          await newPot.save();
          return res.status(201).json(newPot);
        } catch (error) {
          return res.status(500).json({ message: "Error creating pot", error });
        }
      }

      case "PUT": {
        try {
          const { id, name, target, total } = body;

          if (!id || (total !== undefined && typeof total !== "number")) {
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
        } catch (error) {
          return res.status(500).json({ message: "Error updating pot", error });
        }
      }

      case "DELETE": {
        const { id } = body;

        if (!id) {
          return res
            .status(400)
            .json({ message: "Pot ID is required for deletion" });
        }

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
    console.error(`[${method}] Error handling pots:`, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
