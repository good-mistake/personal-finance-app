import express from "express";
import bcrypt from "bcryptjs";
import User from "../../models/models";
import { generateToken } from "../../src/utils/auth";
const router = express.Router();

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = generateToken(user);

    res.status(201).json({ message: "User created successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
