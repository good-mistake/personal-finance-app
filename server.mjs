import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectToDatabase from "./db.mjs";
import signupRoute from "./api/auth/signup.js";
import loginRoute from "./api/auth/login.js";
import verifyRoute from "./api/auth/verify.js";
import refreshRoute from "./api/auth/refresh.js";
import potRoute from "./api/auth/pots/index.js";
import budgetRoute from "./api/auth/budgets/index.js";
import transactionRoute from "./api/auth/transactions/index.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/api/auth/signup", signupRoute);
app.use("/api/auth/login", loginRoute);
app.use("/api/auth/verify", verifyRoute);
app.use("/api/auth/refresh", refreshRoute);
app.use("/api/pots", potRoute);
app.use("/api/budgets", budgetRoute);
app.use("/api/transactions", transactionRoute);

connectToDatabase();

export default app;
