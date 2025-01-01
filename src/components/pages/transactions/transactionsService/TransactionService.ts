const API_URL = "http://localhost:5000/auth/transactions";

export const fetchTransaction = (token: string | null) => {
  return fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((transactionData) => {
      if (!Array.isArray(transactionData)) {
        throw new Error("Invalid data format received from API");
      }
      return transactionData.map((transaction: any) => ({
        id: transaction._id,
        _id: undefined,
        category: transaction.category,
        amount: transaction.amount,
        name: transaction.name,
        date: transaction.date,
        recurring: transaction.recurring,
        theme: transaction.theme,
      }));
    });
};

export const editTransactionAction = async (
  token: string | null,
  updatedTransaction: any
) => {
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
export const deleteTransactionAction = (
  transactionId: string,
  token: string | null
) => {
  const url = `${API_URL}/${transactionId}`;

  return fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to delete transaction. Status: ${response.status}`
        );
      }
      return response.json();
    })
    .then((data) => {})
    .catch((error) => {
      console.error("Error deleting transaction:", error);
    });
};
