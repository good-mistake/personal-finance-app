import { connectToDatabase } from "../../db.js";
import loginHandler from "./login/index.js";
const allowedOrigins = [
  "https://personal-finance-app-nu.vercel.app",
  "https://personal-finance-app-git-main-goodmistakes-projects.vercel.app",
  "https://personal-finance-axn5n3ht9-goodmistakes-projects.vercel.app",
];

const setCorsHeaders = (res, origin) => {
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS, GET, PUT, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
};

export default async function handler(req, res) {
  await connectToDatabase();

  const { method, headers } = req;
  const origin = headers.origin;

  setCorsHeaders(res, origin);

  if (method === "OPTIONS") {
    return res.status(200).end();
  }

  if (method === "POST") {
    try {
      return await loginHandler(req, res);
    } catch (error) {
      console.error("Error in loginHandler:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).json({ message: `Method ${method} not allowed` });
}
