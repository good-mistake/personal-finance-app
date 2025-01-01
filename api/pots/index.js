import express from "express";
import Pot from "../../models/Pot";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pots = await Pot.find();
    res.status(200).json(pots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { name, targetAmount } = req.body;
  try {
    const newPot = new Pot({ name, targetAmount });
    await newPot.save();
    res.status(201).json(newPot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
