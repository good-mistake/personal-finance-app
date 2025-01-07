import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../models/models.js";
import { connectToDatabase } from "../../../db.js";
export default async function loginHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectToDatabase();

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      result: {
        name: user.name,
        email: user.email,
        pots: user.pots,
        budgets: user.budgets,
        transactions: user.transactions,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
