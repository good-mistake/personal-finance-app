import Pot from "../../models/Pot";
import { connectToDatabase } from "../../db";

export default async function handler(req, res) {
  await connectToDatabase();

  const allowedOrigins = [
    "https://personal-finance-app-nu.vercel.app",
    "https://personal-finance-app-git-main-goodmistakes-projects.vercel.app",
    "https://personal-finance-axn5n3ht9-goodmistakes-projects.vercel.app",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
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

  const { method } = req;

  try {
    if (method === "GET") {
      const pots = await Pot.find();
      return res.status(200).json(pots);
    }

    if (method === "POST") {
      const { name, target, total, theme } = req.body;

      if (!name || target === undefined || total === undefined || !theme) {
        return res.status(400).json({
          message: "Name, target, total, and theme are required.",
        });
      }

      const newPot = new Pot({ name, target, total, theme });
      await newPot.save();
      return res.status(201).json(newPot);
    }

    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
