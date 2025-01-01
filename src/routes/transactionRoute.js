import express from "express";
import User from "../../models/models.js";
import { authenticateToken } from "../utils/middleware.js";
import Transaction from "../../models/transaction.js";
const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const userTransaction = await Transaction.find({ user: req.user.id });
    if (!userTransaction || userTransaction.length === 0) {
      return res
        .status(404)
        .json({ message: "No transaction found for this user" });
    }
    res.status(200).json(userTransaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const { category, amount, date, name, recurring, theme } = req.body;
  if (!category || !amount || !date || !name || !theme) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const newTransaction = new Transaction({
      category,
      amount,
      theme,
      date,
      name,
      recurring,
      user: req.user.id,
    });

    await newTransaction.save();

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.transactions.push(newTransaction._id);
    await user.save();

    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    if (!deletedTransaction) {
      return res.status(404).send({ message: "Transaction not found" });
    }
    const user = await User.findById(req.user.id);
    if (user) {
      user.transactions.pull(id);
      await user.save();
    }
    res.status(200).send({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
