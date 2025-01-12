const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/pots`;

export const fetchPots = async (token) => {
  try {
    const response = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch pots: ${response.statusText}`);
    }

    const potData = await response.json();

    if (!Array.isArray(potData)) {
      throw new Error("Invalid data format received from API");
    }

    return potData.map((pot) => ({
      id: pot._id,
      name: pot.name,
      target: pot.target,
      total: pot.total,
      theme: pot.theme || "default-theme",
    }));
  } catch (error) {
    console.error("Error fetching pots:", error.message);
    throw error;
  }
};

export const addPotAction = async (token, newPot) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newPot),
    });

    if (!response.ok) {
      throw new Error(`Failed to add pot: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error adding pot:", error.message);
    throw error;
  }
};

export const editPotAction = async (token, updatedPot) => {
  try {
    const response = await fetch(`${API_URL}/${updatedPot.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedPot),
    });

    if (!response.ok) {
      throw new Error(`Failed to update pot: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error updating pot:", error.message);
    throw error;
  }
};

export const deletePotAction = async (potId, token) => {
  try {
    const response = await fetch(`${API_URL}/${potId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete pot: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error deleting pot:", error.message);
    throw error;
  }
};

export const addMoneyAction = async (token, addMoneyData) => {
  try {
    const response = await fetch(`${API_URL}/${addMoneyData.id}/add-money`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: addMoneyData.amount }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add money: ${await response.text()}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error adding money:", error.message);
    throw error;
  }
};

export const withdrawAction = async (token, withdrawData) => {
  try {
    const response = await fetch(
      `${API_URL}/${withdrawData.id}/withdraw-money`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: withdrawData.amount }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to withdraw money: ${await response.text()}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error withdrawing money:", error.message);
    throw error;
  }
};
