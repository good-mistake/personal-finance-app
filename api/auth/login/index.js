import User from "../../../models/models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ message: "Database connection issue" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      refreshToken,
      result: {
        name: user.name,
        email: user.email,
        pots: user.pots || [],
        budgets: user.budgets || [],
        transactions: user.transactions || [],
      },
    });
  } catch (error) {
    console.error("Login error details:", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({ message: "Server error. Please try again." });
  }
};
