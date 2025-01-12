const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/pots`;

export const fetchPots = async (token) => {
  try {
    const response = await fetch(API_URL, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Error fetching pots:", errorMessage);
      throw new Error("Failed to fetch pots");
    }

    const potsData = await response.json();
    return potsData.map((pot) => ({
      ...pot,
      id: pot._id,
      _id: undefined,
    }));
  } catch (error) {
    console.error("Error fetching pots:", error.message);
    throw error;
  }
};

/**

 * @param {string | null} token
 * @param {Object} withdrawalData
 * @returns {Promise<Object>}
 */
export const withdrawAction = async (token, withdrawalData) => {
  if (!token) throw new Error("Authorization token is required");

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

export const addMoneyAction = async (token, addMoneyData) => {
  if (!token) throw new Error("Authorization token is required");

  try {
    const response = await fetch(`${API_URL}/add-money/${addMoneyData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: addMoneyData.amount }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Failed to update pot:", errorMessage);
      throw new Error(errorMessage || "Failed to update pot");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in addMoneyAction:", error.message);
    throw error;
  }
};

export const editPotAction = async (token, updatedPot) => {
  if (!token) throw new Error("Authorization token is required");

  const response = await fetch(`${API_URL}/${updatedPot.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedPot),
  });

  if (!response.ok) throw new Error("Failed to update pot");

  return response.json();
};

/**
 * @param {string} potId
 * @param {string | null} token
 * @returns {Promise<void>}
 */
export const deletePotAction = async (potId, token) => {
  const response = await fetch(`${API_URL}/${potId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to delete pot: ${errorMessage}`);
  }
};
