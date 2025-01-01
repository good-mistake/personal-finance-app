import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  category: { type: String, required: true },
  maximum: { type: Number, required: true },
  theme: { type: String, default: "#FFFFFF" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Budget = mongoose.model("Budget", BudgetSchema);

export default Budget;
