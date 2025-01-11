const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/budgets`;

export const fetchBudgets = async (token) => {
  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch budgets");
  }

  const budgetsData = await response.json();

  if (!Array.isArray(budgetsData)) {
    throw new Error("Invalid data format received from API");
  }

  return budgetsData.map((budget) => ({
    id: budget._id,
    _id: undefined,
    category: budget.category,
    maximum: budget.maximum,
    theme: budget.theme,
  }));
};

export const editBudgetAction = async (token, updatedBudget) => {
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

export const deleteBudgetAction = async (budgetId, token) => {
  if (!token) {
    throw new Error("Authorization token is required");
  }

  const response = await fetch(`${API_URL}/${budgetId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete budget");
  }

  return response.json();
};

export const fetchTransactionsFromBackend = async (token) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_BASE_URL}/api/transactions`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return response.json();
};
