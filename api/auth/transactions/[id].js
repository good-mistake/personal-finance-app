import Transaction from "../../../models/transaction";
import express from "express";

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
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { amount, category, date, type } = req.body;

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { amount, category, date, type },
      { new: true }
    );

    if (!updatedTransaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json(updatedTransaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
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
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
