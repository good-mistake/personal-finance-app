import express from "express";
import Transaction from "../../../models/transaction";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { amount, category, date, type } = req.body;

  try {
    const newTransaction = new Transaction({
      amount,
      category,
      date,
      type,
    });

    await newTransaction.save();

    res.status(201).json(newTransaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
