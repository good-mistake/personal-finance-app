import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/models";
import connectDB from "../../utils/connectDB";

export default async function handler(req, res) {
  await connectDB();

  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://personal-finance-app-nu.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { method } = req;

  if (method === "GET") {
    try {
      const users = await User.find({});
      return res.status(200).json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Method ${method} not allowed` });
}
