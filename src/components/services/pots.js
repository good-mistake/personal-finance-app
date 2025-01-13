const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/pots`;

export const fetchPots = async (token) => {
  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pots");
  }

  const potsData = await response.json();
  return potsData.map((pot) => ({
    ...pot,
    id: pot._id,
    _id: undefined,
  }));
};

/**
 * Add money to a pot
 * @param {string | null} token
 * @param {Object} addMoneyData
 * @returns {Promise<Object>}
 */
export const addMoneyAction = async (token, addMoneyData) => {
  if (!token) throw new Error("Authorization token is required");

  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id: addMoneyData.id, amount: addMoneyData.amount }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to add money to pot: ${errorMessage}`);
  }

  return response.json();
};

/**
 * Withdraw money from a pot
 * @param {string | null} token
 * @param {Object} withdrawalData
 * @returns {Promise<Object>}
 */
export const withdrawAction = async (token, withdrawalData) => {
  if (!token) throw new Error("Authorization token is required");

  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: withdrawalData.id,
      amount: -withdrawalData.amount,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to withdraw money from pot");
  }

  return response.json();
};

/**
 * Edit a pot
 * @param {string | null} token
 * @param {Object} updatedPot
 * @returns {Promise<Object>}
 */
export const editPotAction = async (token, updatedPot) => {
  if (!token) throw new Error("Authorization token is required");

  const { id, ...updates } = updatedPot;

  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, ...updates }),
  });

  if (!response.ok) throw new Error("Failed to update pot");

  return response.json();
};

/**
 * Delete a pot
 * @param {string} potId
 * @param {string | null} token
 * @returns {Promise<void>}
 */
export const deletePotAction = async (potId, token) => {
  const response = await fetch(API_URL, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: potId }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to delete pot: ${errorMessage}`);
  }
};
