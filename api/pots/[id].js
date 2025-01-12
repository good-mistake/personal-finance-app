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

  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return res.status(200).end();
  }

  const { method } = req;
  const { id } = req.query;

  try {
    if (method === "GET") {
      const pot = await Pot.findById(id);
      if (!pot) return res.status(404).json({ message: "Pot not found" });
      return res.status(200).json(pot);
    }

    if (method === "PUT") {
      const { amount } = req.body;
      const { addMoney, withdrawMoney } = req.query;

      const pot = await Pot.findById(id);
      if (!pot) return res.status(404).json({ message: "Pot not found" });

      if (addMoney) {
        if (amount === undefined) {
          return res.status(400).json({ message: "Amount is required" });
        }

        pot.total += amount;
        await pot.save();

        return res.status(200).json(pot);
      }

      if (withdrawMoney) {
        if (amount === undefined) {
          return res.status(400).json({ message: "Amount is required" });
        }

        pot.total -= amount;
        await pot.save();

        return res.status(200).json(pot);
      }

      return res.status(400).json({ message: "Invalid action specified" });
    }

    if (method === "DELETE") {
      const deletedPot = await Pot.findByIdAndDelete(id);
      if (!deletedPot)
        return res.status(404).json({ message: "Pot not found" });

      return res.status(200).json({ message: "Pot deleted successfully" });
    }

    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
