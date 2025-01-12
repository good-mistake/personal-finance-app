const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/pots`;

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "An error occurred");
  }
  return response.json();
};

export const fetchPots = async (token) => {
  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
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
  return handleResponse(response);
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
  return handleResponse(response);
};

export const deletePotAction = async (token, potId) => {
  const response = await fetch(`${API_URL}/${potId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const addMoneyAction = async (token, addMoneyData) => {
  const response = await fetch(`${API_URL}/${addMoneyData.id}/add-money`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount: addMoneyData.amount }),
  });
  return handleResponse(response);
};

export const withdrawAction = async (token, withdrawData) => {
  const response = await fetch(`${API_URL}/${withdrawData.id}/withdraw-money`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount: withdrawData.amount }),
  });
  return handleResponse(response);
};
