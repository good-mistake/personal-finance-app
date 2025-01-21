const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/budgets`;

/**
 * Fetches all budgets from the API.
 * @param {string} token - The authorization token for the API.
 * @returns {Promise<Array>} - An array of formatted budgets.
 */
export const fetchBudgets = async (token) => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch budgets: ${response.statusText}`);
    }

    const budgetsData = await response.json();

    if (!Array.isArray(budgetsData)) {
      throw new Error("Invalid data format received from API");
    }

    return budgetsData.map((budget) => ({
      id: budget._id,
      category: budget.category,
      maximum: budget.maximum,
      theme: budget.theme,
    }));
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw error;
  }
};

/**
 * Adds a new budget.
 * @param {string} token - The authorization token for the API.
 * @param {Object} newBudget - The budget data to add.
 * @returns {Promise<Object>} - The created budget.
 */
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
      const errorMessage = await response.text();
      throw new Error(`Failed to add budget: ${errorMessage}`);
    }

    const createdBudget = await response.json();

    return {
      id: createdBudget._id,
      ...createdBudget,
    };
  } catch (error) {
    console.error("Error adding budget:", error);
    throw error;
  }
};

/**
 * Updates a budget.
 * @param {string} token - The authorization token for the API.
 * @param {Object} updatedBudget - The updated budget data.
 * @returns {Promise<Object>} - The updated budget.
 */
export const editBudgetAction = async (token, updatedBudget) => {
  const response = await fetch(`${API_URL}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: updatedBudget.id,
      category: updatedBudget.category,
      maximum: updatedBudget.maximum,
      theme: updatedBudget.theme,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update budget: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Deletes a budget by ID.
 * @param {string} token - The authorization token for the API.
 * @param {string} budgetId - The ID of the budget to delete.
 * @returns {Promise<Object>} - A success message or the deleted budget.
 */
export const deleteBudgetAction = async (budgetId, token) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: budgetId }), // Send ID in the body
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to delete budget: ${errorMessage}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error deleting budget:", error);
    throw error;
  }
};

const TRANSACTION_API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/transactions`;

/**
 * Fetches all transactions from the API.
 * @param {string} token - The authorization token for the API.
 * @returns {Promise<Array>} - An array of formatted transactions.
 */
export const fetchTransactionsFromBackend = async (token) => {
  try {
    const response = await fetch(TRANSACTION_API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }

    const transactionsData = await response.json();

    return transactionsData.map((transaction) => ({
      id: transaction._id,
      category: transaction.category,
      amount: transaction.amount,
      name: transaction.name,
      date: transaction.date,
      recurring: transaction.recurring,
      theme: transaction.theme,
    }));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};
