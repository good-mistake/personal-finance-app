import express from "express";
import Transaction from "../../models/Transaction";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await Transaction.findById(id);
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { amount, category } = req.body;
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { amount, category },
      { new: true }
    );
    if (!updatedTransaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json(updatedTransaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    if (!deletedTransaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json({ message: "Transaction deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
