import { connectToDatabase } from "../../db.js";
import User from "../../models/models.js";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await connectToDatabase();
  console.log("Authorization header:", req.headers.authorization);
  console.log("Request body:", req.body);

  const allowedOrigins = [
    "https://personal-finance-app-nu.vercel.app",
    "https://personal-finance-app-git-main-goodmistakes-projects.vercel.app",
    "https://personal-finance-axn5n3ht9-goodmistakes-projects.vercel.app",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { method } = req;

  try {
    // Handle GET requests
    if (method === "GET") {
      console.log("GET request received");

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        const userId = decoded.id;
        const user = await User.findById(userId);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        console.log("Transactions retrieved successfully");
        return res.status(200).json(user.transactions);
      } catch (error) {
        console.error("Error retrieving transactions:", error);
        return res
          .status(500)
          .json({ message: "Failed to retrieve transactions", error });
      }
    }

    // Handle POST requests
    if (method === "POST") {
      const { name, amount, category, date, recurring, theme } = req.body;

      console.log("POST request received with payload:", req.body);

      if (
        !name ||
        !amount ||
        !category ||
        !date ||
        recurring === undefined ||
        !theme
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        const userId = decoded.id;
        const user = await User.findById(userId);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const newTransaction = {
          name,
          amount,
          category,
          date,
          recurring,
          theme,
        };

        user.transactions.push(newTransaction);
        await user.save();

        console.log("Transaction saved successfully");
        return res.status(201).json(newTransaction);
      } catch (error) {
        console.error("Error saving transaction:", error);
        return res
          .status(500)
          .json({ message: "Failed to save transaction", error });
      }
    }

    // If method is not allowed
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Unhandled error in transactions API:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
