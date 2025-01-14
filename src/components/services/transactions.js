const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/transactions`;

/**
 * Fetches all transactions from the API.
 * @param {string} token - The authorization token for the API.
 * @returns {Promise<Array>} - An array of formatted transactions.
 */
export const fetchTransaction = async (token) => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }

    const transactionData = await response.json();

    if (!Array.isArray(transactionData)) {
      throw new Error("Invalid data format received from API");
    }

    // Map and clean transaction data
    return transactionData.map((transaction) => ({
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

/**
 * Updates a transaction by ID.
 * @param {string} token - The authorization token for the API.
 * @param {Object} updatedTransaction - The updated transaction data.
 * @returns {Promise<Object>} - The updated transaction.
 */
export const editTransactionAction = async (token, updatedTransaction) => {
  try {
    if (!token) {
      throw new Error("Authorization token is required");
    }

    const { id, ...updateFields } = updatedTransaction;

    if (!id) {
      throw new Error("Transaction ID is required for editing");
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateFields),
    });

    if (!response.ok) {
      throw new Error(`Failed to update transaction: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

/**
 * Deletes a transaction by ID.
 * @param {string} transactionId - The ID of the transaction to delete.
 * @param {string} token - The authorization token for the API.
 * @returns {Promise<Object>} - A success message or the deleted transaction.
 */
export const deleteTransactionAction = async (transactionId, token) => {
  try {
    if (!token) {
      throw new Error("Authorization token is required");
    }

    if (!transactionId) {
      throw new Error("Transaction ID is required for deletion");
    }

    const response = await fetch(`${API_URL}/${transactionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete transaction: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};
