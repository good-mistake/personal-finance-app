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
    switch (method) {
      case "GET": {
        const budget = await Budget.findById(id);
        if (!budget) {
          return res.status(404).json({ message: "Budget not found" });
        }
        return res.status(200).json(budget);
      }

      case "PUT": {
        const { category, maxAmount, themeColor } = req.body;

        if (!category || !maxAmount || !themeColor) {
          return res.status(400).json({
            message: "Category, maxAmount, and themeColor are required.",
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
        const deletedBudget = await Budget.findByIdAndDelete(id);
        if (!deletedBudget) {
          return res.status(404).json({ message: "Budget not found" });
        }
        return res
          .status(200)
          .json({ message: "Budget deleted successfully." });
      }

      default: {
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
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
