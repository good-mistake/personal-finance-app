import express from "express";
import { generateRefreshToken } from "../../src/utils/auth";
const router = express.Router();

router.post("/", (req, res) => {
  const { refreshToken: refreshTokenFromClient } = req.body;

  if (!refreshTokenFromClient) {
    return res.status(400).json({ message: "Refresh token required" });
  }

  try {
    const newToken = generateRefreshToken(refreshTokenFromClient);
    res.status(200).json({ token: newToken });
  } catch (err) {
    res.status(500).json({ message: "Failed to refresh token" });
  }
});

export default router;
