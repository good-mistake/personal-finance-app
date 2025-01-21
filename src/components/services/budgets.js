const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/budgets`;

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.statusText}`);
  }
  return response.json();
};

export const fetchBudgets = async (token) => {
  try {
    const response = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const budgetData = await handleResponse(response);

    return budgetData.map((budget) => ({
      id: budget._id,
      category: budget.category,
      maxAmount: budget.maxAmount,
      themeColor: budget.themeColor,
    }));
  } catch (error) {
    console.error("Error fetching budgets:", error.message);
    throw error;
  }
};

export const addBudget = async (token, newBudget) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newBudget),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error adding budget:", error.message);
    throw error;
  }
};

export const updateBudget = async (token, updatedBudget) => {
  try {
    const response = await fetch(`${API_URL}/${updatedBudget.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedBudget),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error updating budget:", error.message);
    throw error;
  }
};

export const deleteBudget = async (budgetId, token) => {
  try {
    const response = await fetch(`${API_URL}/${budgetId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error deleting budget:", error.message);
    throw error;
  }
};

export const fetchTransactions = async (token) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/transactions`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const transactionData = await handleResponse(response);

    return transactionData.map((transaction) => ({
      id: transaction._id,
      category: transaction.category,
      amount: transaction.amount,
      name: transaction.name,
      date: transaction.date,
      recurring: transaction.recurring,
      themeColor: transaction.themeColor,
    }));
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    throw error;
  }
};
