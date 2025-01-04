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
        { http: { path: "/api/auth/login", method: "post", cors: true } },
        { http: { path: "/api/auth/signup", method: "post", cors: true } },
        { http: { path: "/api/auth/verify", method: "post", cors: true } },
      ],
    },
    budgets: {
      handler: "budgets.handler",
      events: [
        { http: { path: "/api/budgets", method: "get", cors: true } },
        { http: { path: "/api/budgets/{id}", method: "get", cors: true } },
        { http: { path: "/api/budgets", method: "post", cors: true } },
        { http: { path: "/api/budgets/{id}", method: "put", cors: true } },
        { http: { path: "/api/budgets/{id}", method: "delete", cors: true } },
      ],
    },
    transactions: {
      handler: "transactions.handler",
      events: [
        { http: { path: "/api/transactions", method: "get", cors: true } },
        { http: { path: "/api/transactions/{id}", method: "get", cors: true } },
        { http: { path: "/api/transactions", method: "post", cors: true } },
        { http: { path: "/api/transactions/{id}", method: "put", cors: true } },
        {
          http: {
            path: "/api/transactions/{id}",
            method: "delete",
            cors: true,
          },
        },
      ],
    },
    pots: {
      handler: "pots.handler",
      events: [
        { http: { path: "/api/pots", method: "get", cors: true } },
        { http: { path: "/api/pots/{id}", method: "get", cors: true } },
        { http: { path: "/api/pots", method: "post", cors: true } },
        { http: { path: "/api/pots/{id}", method: "put", cors: true } },
        { http: { path: "/api/pots/{id}", method: "delete", cors: true } },
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
