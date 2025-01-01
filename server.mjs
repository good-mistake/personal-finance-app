import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./src/routes/routes.js";
import potRoute from "./src/routes/potRoute.js";
import budgetRoute from "./src/routes/budgetRoute.js";
import transactionRoute from "./src/routes/transactionRoute.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", router);
app.use("/auth/pots", potRoute);
app.use("/auth/budgets", budgetRoute);
app.use("/auth/transactions", transactionRoute);
const uri =
  process.env.MONGO_URI ||
  "MONGO_URI=mongodb+srv://admin:5TTbUJAysMWcdzSn@cluster0.yv9sg.mongodb.net/personalFinanceApp?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });
