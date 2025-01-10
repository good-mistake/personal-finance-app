import { connectToDatabase } from "../../db.js";
import Budget from "../../models/budgets.js";

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

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
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
        const budgets = await Budget.find();
        return res.status(200).json(budgets);
      }

      case "POST": {
        const { category, maxAmount, themeColor } = req.body;

        if (!category || !maxAmount || !themeColor) {
          return res.status(400).json({
            message: "Category, maxAmount, and themeColor are required.",
          });
        }

        const newBudget = new Budget({ category, maxAmount, themeColor });
        await newBudget.save();

        return res.status(201).json(newBudget);
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
