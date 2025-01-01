import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  theme: { type: String, default: "#FFFFFF" },
  date: { type: Date, default: Date.now },
  name: { type: String, required: true, maxlength: 30 },
  recurring: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
