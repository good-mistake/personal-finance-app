import express from "express";
import Budget from "../../../models/budgets";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.status(200).json(budgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { category, maxAmount, themeColor } = req.body;

  try {
    const newBudget = new Budget({
      category,
      maxAmount,
      themeColor,
    });

    await newBudget.save();

    res.status(201).json(newBudget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
