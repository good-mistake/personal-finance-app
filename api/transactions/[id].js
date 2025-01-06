import Transaction from "../../../models/Transaction";
import { connectToDatabase } from "../../../db.js";

export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;
  const { id } = req.query;

  try {
    if (method === "GET") {
      const transaction = await Transaction.findById(id);
      if (!transaction)
        return res.status(404).json({ message: "Transaction not found" });
      return res.status(200).json(transaction);
    }

    if (method === "PUT") {
      const { amount, category } = req.body;
      const updatedTransaction = await Transaction.findByIdAndUpdate(
        id,
        { amount, category },
        { new: true }
      );
      if (!updatedTransaction)
        return res.status(404).json({ message: "Transaction not found" });
      return res.status(200).json(updatedTransaction);
    }

    if (method === "DELETE") {
      const deletedTransaction = await Transaction.findByIdAndDelete(id);
      if (!deletedTransaction)
        return res.status(404).json({ message: "Transaction not found" });
      return res.status(200).json({ message: "Transaction deleted" });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ message: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
