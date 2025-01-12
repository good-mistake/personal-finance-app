import Pot from "../../models/Pot.js";
import { connectToDatabase } from "../../db.js";

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
    switch (method) {
      case "GET": {
        const pots = await Pot.find();
        return res.status(200).json(pots);
      }

      case "POST": {
        const { name, target, total } = req.body;

        if (!name || target == null || total == null) {
          return res.status(400).json({
            message: "Name, target, and total are required.",
          });
        }

        const newPot = new Pot({ name, target, total });
        await newPot.save();
        return res.status(201).json(newPot);
      }

      case "PUT": {
        const { id } = req.query;
        const { name, target, total } = req.body;

        if (!id || name == null || target == null || total == null) {
          return res.status(400).json({
            message: "ID, name, target, and total are required.",
          });
        }

        const updatedPot = await Pot.findByIdAndUpdate(
          id,
          { name, target, total },
          { new: true }
        );

        if (!updatedPot) {
          return res.status(404).json({ message: "Pot not found" });
        }

        return res.status(200).json(updatedPot);
      }

      case "DELETE": {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({ message: "ID is required" });
        }

        const deletedPot = await Pot.findByIdAndDelete(id);

        if (!deletedPot) {
          return res.status(404).json({ message: "Pot not found" });
        }

        return res.status(200).json({ message: "Pot deleted successfully" });
      }

      default: {
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
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
