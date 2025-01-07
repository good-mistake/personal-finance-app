import { connectToDatabase } from "../../db.js";
import Budget from "../../models/models.js";
export default async function handler(req, res) {
  await connectToDatabase();

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
