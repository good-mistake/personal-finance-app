const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/budgets`;

export const fetchBudgets = async (token) => {
  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch budgets");
  }

  return response.json();
};

export const addBudgetAction = async (token, newBudget) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newBudget),
  });

  if (!response.ok) {
    throw new Error("Failed to add budget");
  }

  return response.json();
};

export const editBudgetAction = async (token, updatedBudget) => {
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
  const response = await fetch(`${API_URL}/${budgetId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete budget");
  }

  return response.json();
};
