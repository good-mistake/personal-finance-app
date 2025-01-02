require("dotenv").config();

module.exports = {
  service: "personal-finance-app",

  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    region: "us-east-1",
    environment: {
      MONGO_URI: process.env.MONGO_URI,
      JWT_SECRET: process.env.JWT_SECRET,
      REFRESH_SECRET: process.env.REFRESH_SECRET,
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    },
  },

  functions: {
    auth: {
      handler: "auth.handler",
      events: [
        { http: { path: "/auth/login", method: "post" } },
        { http: { path: "/auth/signup", method: "post" } },
        { http: { path: "/auth/verify", method: "post" } },
      ],
    },
    budgets: {
      handler: "budgets.handler",
      events: [
        { http: { path: "/budgets", method: "get" } },
        { http: { path: "/budgets/{id}", method: "get" } },
        { http: { path: "/budgets", method: "post" } },
        { http: { path: "/budgets/{id}", method: "put" } },
        { http: { path: "/budgets/{id}", method: "delete" } },
      ],
    },
    transactions: {
      handler: "transactions.handler",
      events: [
        { http: { path: "/transactions", method: "get" } },
        { http: { path: "/transactions/{id}", method: "get" } },
        { http: { path: "/transactions", method: "post" } },
        { http: { path: "/transactions/{id}", method: "put" } },
        { http: { path: "/transactions/{id}", method: "delete" } },
      ],
    },
    pots: {
      handler: "pots.handler",
      events: [
        { http: { path: "/pots", method: "get" } },
        { http: { path: "/pots/{id}", method: "get" } },
        { http: { path: "/pots", method: "post" } },
        { http: { path: "/pots/{id}", method: "put" } },
        { http: { path: "/pots/{id}", method: "delete" } },
      ],
    },
  },

  plugins: ["serverless-webpack", "serverless-offline"],

  custom: {
    webpack: {
      includeModules: true,
    },
  },
};
