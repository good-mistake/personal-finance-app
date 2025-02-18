import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
});

export const fetchBudgets = async (token: string) => {
  const response = await axiosInstance.get("/api/budgets", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchTransactions = async (token: string) => {
  const response = await axiosInstance.get("/api/transactions", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchPots = async (token: string) => {
  const response = await axiosInstance.get("/api/pots", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
