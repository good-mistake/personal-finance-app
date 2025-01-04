import express from "express";
import Pot from "../../models/Pot";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pot = await Pot.findById(id);
    if (!pot) return res.status(404).json({ message: "Pot not found" });
    res.status(200).json(pot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, targetAmount } = req.body;
  try {
    const updatedPot = await Pot.findByIdAndUpdate(
      id,
      { name, targetAmount },
      { new: true }
    );
    if (!updatedPot) return res.status(404).json({ message: "Pot not found" });
    res.status(200).json(updatedPot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPot = await Pot.findByIdAndDelete(id);
    if (!deletedPot) return res.status(404).json({ message: "Pot not found" });
    res.status(200).json({ message: "Pot deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
