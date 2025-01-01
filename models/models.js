import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: String,
  balance: {
    current: { type: Number, default: 0 },
    income: { type: Number, default: 0 },
    expenses: { type: Number, default: 0 },
  },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  budgets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Budget" }],
  pots: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pot" }],
});
const User = mongoose.model("User", userSchema);
export default User;
