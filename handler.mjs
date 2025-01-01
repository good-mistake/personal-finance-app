import serverless from "serverless-http";
import app from "./server.mjs";

export const api = serverless(app);
