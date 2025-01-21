import Budget from "../../models/budgets.js";
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
        const budgets = await Budget.find();
        return res.status(200).json(budgets);
      }

      case "POST": {
        const { category, maxAmount, themeColor } = req.body;

        if (!category || maxAmount === undefined || !themeColor) {
          return res.status(400).json({
            message: "Category, maxAmount, and themeColor are required.",
          });
        }

        const newBudget = new Budget({ category, maxAmount, themeColor });
        await newBudget.save();
        return res.status(201).json(newBudget);
      }

      case "PUT": {
        const { id, category, maxAmount, themeColor } = req.body;

        if (!id || !category || maxAmount === undefined || !themeColor) {
          return res.status(400).json({
            message: "ID, category, maxAmount, and themeColor are required.",
          });
        }

        const updatedBudget = await Budget.findByIdAndUpdate(
          id,
          { category, maxAmount, themeColor },
          { new: true, runValidators: true }
        );

        if (!updatedBudget) {
          return res.status(404).json({ message: "Budget not found" });
        }

        return res.status(200).json(updatedBudget);
      }

      case "DELETE": {
        const { id } = req.body;

        if (!id) {
          return res
            .status(400)
            .json({ message: "ID is required for deletion." });
        }

        const deletedBudget = await Budget.findByIdAndDelete(id);

        if (!deletedBudget) {
          return res.status(404).json({ message: "Budget not found" });
        }

        return res
          .status(200)
          .json({ message: "Budget deleted successfully." });
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
