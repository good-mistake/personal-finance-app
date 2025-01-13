import Pot from "../../models/Pot.js";
import { connectToDatabase } from "../../db.js";

export default async function handler(req, res) {
  await connectToDatabase();

  const { method, body } = req;

  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://personal-finance-app-nu.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    switch (method) {
      case "GET": {
        const pots = await Pot.find({});
        return res.status(200).json(pots);
      }

      case "POST": {
        const { name, target, total } = body;

        if (!name || typeof target !== "number" || typeof total !== "number") {
          return res.status(400).json({ message: "Invalid pot data" });
        }

        const newPot = await Pot.create({ name, target, total });
        return res.status(201).json(newPot);
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "OPTIONS"]);
        return res
          .status(405)
          .json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error(`[${method}] Error handling pots:`, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
