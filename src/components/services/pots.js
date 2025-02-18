const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/pots`;

/**
 * Fetches all pots from the API.
 * @param {string} token - The authorization token for the API.
 * @returns {Promise<Array>} - An array of formatted pots.
 */
export const fetchPots = async (token) => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch pots: ${response.statusText}`);
    }

    const potsData = await response.json();

    if (!Array.isArray(potsData)) {
      throw new Error("Invalid data format received from API");
    }

    return potsData.map((pot) => ({
      id: pot._id,
      name: pot.name,
      target: pot.target,
      total: pot.total || 0,
      theme: pot.theme,
    }));
  } catch (error) {
    console.error("Error fetching pots:", error);
    throw error;
  }
};

/**
 * Adds money to a pot.
 * @param {string} token - The authorization token for the API.
 * @param {Object} addMoneyData - The pot ID and amount to add.
 * @returns {Promise<Object>} - The updated pot.
 */
export const addMoneyAction = async (token, addMoneyData) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        potId: addMoneyData.id || addMoneyData._id,
        amount: addMoneyData.amount,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to add money to pot: ${errorMessage}`);
    }

    const updatedPot = await response.json();

    return {
      id: updatedPot._id || updatedPot.id,
      ...updatedPot,
    };
  } catch (error) {
    console.error("Error adding money to pot:", error);
    throw error;
  }
};

/**
 * Withdraws money from a pot.
 * @param {string} token - The authorization token for the API.
 * @param {Object} withdrawalData - The pot ID and amount to withdraw.
 * @returns {Promise<Object>} - The updated pot.
 */
export const withdrawAction = async (token, withdrawalData) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        potId: withdrawalData.id,
        amount: -withdrawalData.amount,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to withdraw money from pot");
    }

    const updatedPot = await response.json();

    return {
      id: updatedPot._id,
      ...updatedPot,
    };
  } catch (error) {
    console.error("Error withdrawing money from pot:", error);
    throw error;
  }
};

/**
 * Updates a pot.
 * @param {string} token - The authorization token for the API.
 * @param {Object} updatedPot - The updated pot data.
 * @returns {Promise<Object>} - The updated pot.
 */
export const editPotAction = async (token, updatedPot) => {
  try {
    const { id, ...updates } = updatedPot;

    const response = await fetch(`${API_URL}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        potId: id,
        ...updates,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update pot: ${response.statusText}`);
    }

    const updatedData = await response.json();

    return {
      id: updatedData._id,
      ...updatedData,
    };
  } catch (error) {
    console.error("Error updating pot:", error);
    throw error;
  }
};

/**
 * Deletes a pot by ID.
 * @param {string} potId - The ID of the pot to delete.
 * @param {string} token - The authorization token for the API.
 * @returns {Promise<Object>} - A success message or the deleted pot.
 */
export const deletePotAction = async (potId, token) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ potId }), // Send potId in the body
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to delete pot: ${errorMessage}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error deleting pot:", error);
    throw error;
  }
};
