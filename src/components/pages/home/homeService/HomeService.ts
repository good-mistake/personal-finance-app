import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    "https://personal-finance-app-git-main-goodmistakes-projects.vercel.app",
});

export const fetchBudgets = async (token: string) => {
  const response = await axiosInstance.get("/api/auth/budgets", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchTransactions = async (token: string) => {
  const response = await axiosInstance.get("/api/auth/transactions", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchPots = async (token: string) => {
  const response = await axiosInstance.get("/api/auth/pots", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
