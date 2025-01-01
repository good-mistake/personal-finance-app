import mongoose from "mongoose";

const potSchema = new mongoose.Schema({
  name: { type: String, required: true },
  target: { type: Number, required: true },
  total: { type: Number, default: 0 },
  theme: { type: String, default: "#FFFFFF" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Pot = mongoose.model("Pot", potSchema);

export default Pot;
