const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/budgets`;

export const fetchBudgets = async (token) => {
  try {
    const response = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch budgets: ${response.statusText}`);
    }

    const budgetData = await response.json();

    if (!Array.isArray(budgetData)) {
      throw new Error("Invalid data format received from API");
    }

    return budgetData.map((budget) => ({
      id: budget._id,
      _id: undefined,
      category: budget.category,
      maximum: budget.maximum,
      theme: budget.theme,
    }));
  } catch (error) {
    console.error("Error fetching budgets:", error.message);
    throw error;
  }
};

export const addBudgetAction = async (token, newBudget) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newBudget),
    });

    if (!response.ok) {
      throw new Error(`Failed to add budget: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error adding budget:", error.message);
    throw error;
  }
};

export const editBudgetAction = async (token, updatedBudget) => {
  try {
    const response = await fetch(`${API_URL}/${updatedBudget.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedBudget),
    });

    if (!response.ok) {
      throw new Error(`Failed to update budget: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error updating budget:", error.message);
    throw error;
  }
};

export const deleteBudgetAction = async (budgetId, token) => {
  try {
    const response = await fetch(`${API_URL}/${budgetId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete budget: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error deleting budget:", error.message);
    throw error;
  }
};

export const fetchTransactionsFromBackend = async (token) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/transactions`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch transactions from backend: ${response.statusText}`
      );
    }

    const transactions = await response.json();

    if (!Array.isArray(transactions)) {
      throw new Error("Invalid data format received from API");
    }

    return transactions.map((transaction) => ({
      id: transaction._id,
      _id: undefined,
      category: transaction.category,
      amount: transaction.amount,
      name: transaction.name,
      date: transaction.date,
      recurring: transaction.recurring,
      theme: transaction.theme,
    }));
  } catch (error) {
    console.error("Error fetching transactions from backend:", error.message);
    throw error;
  }
};
