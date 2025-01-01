const API_URL = "http://localhost:5000/auth/pots";

export const fetchPots = (token: string | null) => {
  return fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((potsData) =>
      potsData.map((pot: any) => ({
        ...pot,
        id: pot._id,
        _id: undefined,
      }))
    );
};

export const withdrawAction = async (
  token: string | null,
  withdrawalData: { id: string; amount: number }
): Promise<{ id: string; amount: number }> => {
  if (!token) {
    throw new Error("Authorization token is required");
  }
  const response = await fetch(`${API_URL}/withdraw/${withdrawalData.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount: withdrawalData.amount }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to withdraw money from pot");
  }

  return response.json();
};

export const addMoneyAction = async (
  token: string | null,
  addMoney: { id: string; amount: number }
) => {
  if (!token) {
    throw new Error("Authorization token is required");
  }
  const response = await fetch(`${API_URL}/add-money/${addMoney.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount: addMoney.amount }),
  });
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to update pot: ${errorMessage}`);
  }

  return response.json();
};

export const editPotAction = async (token: string | null, updatedPot: any) => {
  if (!token) {
    throw new Error("Authorization token is required");
  }
  const response = await fetch(`${API_URL}/${updatedPot.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedPot),
  });

  if (!response.ok) {
    throw new Error("Failed to update pot");
  }

  return response.json();
};
export const deletePotAction = (potId: string, token: string | null) => {
  const url = `${API_URL}/${potId}`;

  return fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to delete pot. Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Pot deleted successfully:", data);
    })
    .catch((error) => {
      console.error("Error deleting pot:", error);
    });
};
