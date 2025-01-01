import express from "express";
import User from "../../models/models.js";
import { authenticateToken } from "../utils/middleware.js";
import Budgets from "../../models/budgets.js";
const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const userBudgets = await Budgets.find({ user: req.user.id });
    if (!userBudgets || userBudgets.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(userBudgets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.post("/", authenticateToken, async (req, res) => {
  const { category, maximum, theme } = req.body;
  if (!category || !maximum || !theme) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const newBudget = new Budgets({
      category,
      maximum,
      theme,
      user: req.user.id,
    });

    await newBudget.save();

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.budgets.push(newBudget._id);
    await user.save();

    res.status(201).json(newBudget);
  } catch (error) {
    console.error("Error saving Budget:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBudget = await Budgets.findByIdAndDelete(id);
    if (!deletedBudget) {
      return res.status(404).send({ message: "Budget not found" });
    }
    res.status(200).send({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { category, maximum, theme } = req.body;
  try {
    const updatedBudget = await Budgets.findByIdAndUpdate(
      id,
      { category, maximum, theme },
      { new: true }
    );

    if (!updatedBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json(updatedBudget);
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
