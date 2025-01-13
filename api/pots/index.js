import Pot from "../../models/Pot.js";
import { connectToDatabase } from "../../db.js";

export default async function handler(req, res) {
  await connectToDatabase();

  const { method, body } = req;
  const allowedOrigins = [
    "https://personal-finance-app-nu.vercel.app",
    "https://personal-finance-app-git-main-goodmistakes-projects.vercel.app",
    "https://personal-finance-axn5n3ht9-goodmistakes-projects.vercel.app",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
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
        const { name, target, total } = body;

        if (!name || typeof target !== "number" || typeof total !== "number") {
          return res.status(400).json({ message: "Invalid pot data" });
        }

        const newPot = new Pot({ name, target, total });
        await newPot.save();

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
