import express from "express";
import { verifyToken } from "../../src/utils/auth";
const router = express.Router();

router.get("/", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token required" });
  }

  try {
    const user = verifyToken(token);
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

export default router;
