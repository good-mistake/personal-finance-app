const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/transactions`;

export const fetchTransaction = async (token) => {
  try {
    const response = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }

    const transactionData = await response.json();

    if (!Array.isArray(transactionData)) {
      throw new Error("Invalid data format received from API");
    }

    return transactionData.map((transaction) => ({
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
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const editTransactionAction = async (token, updatedTransaction) => {
  try {
    if (!token) {
      throw new Error("Authorization token is required");
    }

    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedTransaction),
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

export const deleteTransactionAction = async (transactionId, token) => {
  try {
    if (!token) {
      throw new Error("Authorization token is required");
    }

    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: transactionId }),
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
