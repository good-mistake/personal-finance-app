import jwt from "jsonwebtoken";
import { connectToDatabase } from "../../../db.js";
import User from "../../../models/models.js";
import Pot from "../../../models/Pot.js";
import Budget from "../../../models/budgets.js";
import Transaction from "../../../models/transaction.js";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const pots = await Pot.find({ userId: user._id });
      const budgets = await Budget.find({ userId: user._id });
      const transactions = await Transaction.find({ userId: user._id });

      return res.status(200).json({
        valid: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          pots,
          budgets,
          transactions,
        },
      });
    } catch (error) {
      console.error("Error verifying token:", error.message);
      return res.status(401).json({ message: "Token is invalid or expired" });
    }
  }

  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
