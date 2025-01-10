const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/transactions`;

export const fetchTransaction = async (token) => {
  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
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
};

export const editTransactionAction = async (token, updatedTransaction) => {
  if (!token) {
    throw new Error("Authorization token is required");
  }

  const response = await fetch(`${API_URL}/${updatedTransaction.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedTransaction),
  });

  if (!response.ok) {
    throw new Error("Failed to update transaction");
  }

  return response.json();
};

export const deleteTransactionAction = async (transactionId, token) => {
  if (!token) {
    throw new Error("Authorization token is required");
  }

  const response = await fetch(`${API_URL}/${transactionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete transaction");
  }

  return response.json();
};
