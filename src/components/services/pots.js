const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/pots`;

export const fetchPots = async (token) => {
  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pots");
  }

  return response.json();
};

export const addPotAction = async (token, newPot) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newPot),
  });

  if (!response.ok) {
    throw new Error("Failed to add pot");
  }

  return response.json();
};

export const editPotAction = async (token, updatedPot) => {
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

export const deletePotAction = async (potId, token) => {
  const response = await fetch(`${API_URL}/${potId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete pot");
  }

  return response.json();
};
export const addMoneyAction = async (token, addMoneyData) => {
  if (!token) throw new Error("Authorization token is required");

  const response = await fetch(`${API_URL}/${addMoneyData.id}/add-money`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount: addMoneyData.amount }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to update pot: ${errorMessage}`);
  }

  return response.json();
};
