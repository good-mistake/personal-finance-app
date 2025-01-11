import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store.ts";
import {
  closeModal,
  updateBudget,
  resetSelectedBudget,
} from "../../../redux/budgetSlice.ts";
import EditModal from "../../../reusable/editModal/EditModal.tsx";
import { generateColorList } from "../../../../utils/utils.ts";
import { editBudgetAction } from "../../../services/budgets.js";
interface UpdatedData {
  category: string;
  maximum: number;
  theme: string;
}

const EditBudget: React.FC = () => {
  const dispatch = useDispatch();
  const selectedBudget = useSelector(
    (state: RootState) => state.budgets.selectedBudget
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const budgets = useSelector((state: RootState) => state.budgets.budgets);

  const existingColors = budgets.map((budget) => budget.theme);
  const colorOptions = generateColorList(existingColors, 30);
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

  if (!selectedBudget) {
    return null;
  }

  const handleSave = async (updatedData: UpdatedData) => {
    const token = isAuthenticated ? localStorage.getItem("token") : null;
    if (!token) {
      console.error("Token not available for authenticated user");
      return;
    }

    try {
      const updatedBudget = {
        ...selectedBudget,
        ...updatedData,
      };
      const updatedResponse = await editBudgetAction(token, updatedBudget);

      const normalizedResponse = {
        ...updatedResponse,
        id: updatedResponse._id,
        _id: undefined,
      };

      dispatch(updateBudget(normalizedResponse));
      dispatch(closeModal());
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };
  const handleCancel = () => {
    dispatch(resetSelectedBudget());
    dispatch(closeModal());
  };
  return selectedBudget ? (
    <EditModal
      initialData={{
        category: selectedBudget.category,
        maximum: selectedBudget.maximum,
        theme: selectedBudget.theme,
      }}
      categoryOptions={categoryOptions}
      colorOptions={colorOptions}
      existingColors={existingColors}
      onSave={handleSave}
      onCancel={handleCancel}
      description="As your budgets change, feel free to update your spending limits."
    />
  ) : null;
};

export default EditBudget;
