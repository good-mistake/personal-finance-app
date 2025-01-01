import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/models.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    console.log(process.env.JWT_SECRET);

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.status(201).json({ result: user, token });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email })
      .populate("transactions")
      .populate("pots")
      .populate("budgets");
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    const refreshToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    user.refreshToken = refreshToken;
    await user.save();
    res.status(200).json({
      result: {
        name: user.name,
        email: user.email,
        pots: user.pots || [],
        budgets: user.budgets || [],
        transactions: user.transactions || [],
      },
      token,
      refreshToken,
    });
  } catch (error) {
    console.error("Error in login:", error);
    console.error("Error in login:", error.message);

    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});
router.get("/verify", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id)
      .select("name email pots budgets")
      .populate("pots")
      .populate("budgets")
      .populate("transactions");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        balance: user.balance,
        transactions: user.transactions || [],
        pots: user.pots || [],
        budgets: user.budgets || [],
      },
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token is required" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
});

export default router;
