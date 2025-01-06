import Budget from "../../../models/budgets";
import { connectToDatabase } from "../../../db.js";

export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;

  try {
    if (method === "GET") {
      const budgets = await Budget.find();
      return res.status(200).json(budgets);
    }

    if (method === "POST") {
      const { category, maxAmount, themeColor } = req.body;
      const newBudget = new Budget({ category, maxAmount, themeColor });
      await newBudget.save();
      return res.status(201).json(newBudget);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
