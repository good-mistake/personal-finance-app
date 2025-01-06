import Budget from "../../../models/budgets";
import { connectToDatabase } from "../../../db.js";

export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;
  const { id } = req.query;

  try {
    if (method === "GET") {
      const budget = await Budget.findById(id);
      if (!budget) return res.status(404).json({ message: "Budget not found" });
      return res.status(200).json(budget);
    }

    if (method === "PUT") {
      const { category, maxAmount, themeColor } = req.body;
      const updatedBudget = await Budget.findByIdAndUpdate(
        id,
        { category, maxAmount, themeColor },
        { new: true }
      );
      if (!updatedBudget)
        return res.status(404).json({ message: "Budget not found" });
      return res.status(200).json(updatedBudget);
    }

    if (method === "DELETE") {
      const deletedBudget = await Budget.findByIdAndDelete(id);
      if (!deletedBudget)
        return res.status(404).json({ message: "Budget not found" });
      return res.status(200).json({ message: "Budget deleted" });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
