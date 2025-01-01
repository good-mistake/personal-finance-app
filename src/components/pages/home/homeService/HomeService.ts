import axios from "axios";

export const fetchBudgets = async (token: string) => {
  const response = await axios.get("/api/budgets", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchTransactions = async (token: string) => {
  const response = await axios.get("/api/transactions", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchPots = async (token: string) => {
  const response = await axios.get("/api/pots", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
