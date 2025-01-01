import express from "express";
import Budget from "../../../models/budgets";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const budget = await Budget.findById(id);
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.status(200).json(budget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { category, maxAmount, themeColor } = req.body;

  try {
    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      { category, maxAmount, themeColor },
      { new: true }
    );

    if (!updatedBudget)
      return res.status(404).json({ message: "Budget not found" });
    res.status(200).json(updatedBudget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBudget = await Budget.findByIdAndDelete(id);
    if (!deletedBudget)
      return res.status(404).json({ message: "Budget not found" });
    res.status(200).json({ message: "Budget deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
