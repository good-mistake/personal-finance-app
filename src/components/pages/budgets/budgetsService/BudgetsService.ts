const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/auth/budgets`;

export const fetchBudgets = (token: string | null) => {
  return fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((budgetsData) => {
      if (!Array.isArray(budgetsData)) {
        throw new Error("Invalid data format received from API");
      }
      return budgetsData.map((budget: any) => ({
        id: budget._id,
        _id: undefined,
        category: budget.category,
        maximum: budget.maximum,
        theme: budget.theme,
      }));
    });
};

export const editBudgetAction = async (
  token: string | null,
  updatedBudget: any
) => {
  if (!token) {
    throw new Error("Authorization token is required");
  }
  const response = await fetch(`${API_URL}/${updatedBudget.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedBudget),
  });

  if (!response.ok) {
    throw new Error("Failed to update budget");
  }
  return response.json();
};
export const deleteBudgetAction = (budgetId: string, token: string | null) => {
  const url = `${API_URL}/${budgetId}`;

  return fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to delete budget. Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {})
    .catch((error) => {
      console.error("Error deleting budget:", error);
    });
};
export const fetchTransactionsFromBackend = async (
  token: string
): Promise<any[]> => {
  const response = await fetch("http://localhost:5000/auth/transactions", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return await response.json();
};
