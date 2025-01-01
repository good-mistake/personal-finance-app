import React from "react";
import AddModal from "../../../reusable/AddModal/AddModal.tsx";
import { useDispatch, useSelector } from "react-redux";
import { addBudget } from "../../../redux/budgetSlice";
import { RootState } from "../../../redux/store";

const AddBudgetModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useDispatch();
  const budgets = useSelector((state: RootState) => state.pots.pots);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const handleSave = async (newBudget) => {
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/auth/budgets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category: newBudget.category,
            maximum: newBudget.maximum,
            theme: newBudget.theme,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save Budget");
        }

        const savedBudget = await response.json();
        dispatch(addBudget(savedBudget));
      } catch (error) {
        console.error("Error adding Budget:", error);
      }
    } else {
      dispatch(addBudget(newBudget));
    }
  };
  const categoryOptions = [
    "Entertainment",
    "Bills",
    "Groceries",
    "Dining Out",
    "Transportation",
    "Personal Care",
    "Education",
    "Lifestyle",
    "Shopping",
    "General",
  ];
  return (
    <AddModal
      title="Add New Budget"
      description="Choose a category to set a spending budget. These categories can help you monitor spending."
      onSave={handleSave}
      onClose={onClose}
      existingItems={budgets}
      type="budget"
      categoryOptions={categoryOptions}
    />
  );
};

export default AddBudgetModal;
