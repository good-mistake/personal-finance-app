import express from "express";

import User from "../../models/models.js";
import { authenticateToken } from "../utils/middleware.js";
import Pot from "../../models/Pot.js";
const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("pots");
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.pots);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.post("/", authenticateToken, async (req, res) => {
  const { name, target, total, theme } = req.body;
  console.log("Request body:", req.body);

  try {
    const newPot = new Pot({
      name,
      target,
      total,
      theme,
      user: req.user.id,
    });
    console.log("Pot to be saved:", newPot);

    await newPot.save();

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.pots.push(newPot._id);
    await user.save();

    res.status(201).json(newPot);
  } catch (error) {
    console.error("Error saving pot:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPot = await Pot.findByIdAndDelete(id);
    if (!deletedPot) {
      return res.status(404).send({ message: "Pot not found" });
    }
    res.status(200).send({ message: "Pot deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, target, theme } = req.body;

  try {
    const updatedPot = await Pot.findByIdAndUpdate(
      id,
      { name, target, theme },
      { new: true }
    );

    if (!updatedPot) {
      return res.status(404).send({ message: "Pot not found" });
    }

    res.status(200).send(updatedPot);
  } catch (error) {
    res.status(500).send({ message: "Error updating pot", error });
  }
});
router.post("/withdraw/:id", async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const pot = await Pot.findById(id);

    if (!pot) {
      return res.status(404).json({ message: "Pot not found" });
    }

    if (amount > pot.total) {
      return res
        .status(400)
        .json({ message: "Insufficient funds in the pot." });
    }

    pot.total -= amount;
    await pot.save();

    res.status(200).json({ message: "Withdrawal successful", pot });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.put("/add-money/:id", async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    const pot = await Pot.findById(id);
    if (!pot) {
      return res.status(404).json({ message: "Pot not found" });
    }

    pot.total += amount;
    await pot.save();

    res.status(200).json(pot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
