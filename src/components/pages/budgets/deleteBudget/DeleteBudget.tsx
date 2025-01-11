import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store.ts";
import { deleteBudget, closeModal } from "../../../redux/budgetSlice.ts";
import DeleteModal from "../../../reusable/deleteModal/DeleteModal.tsx";
import { deleteBudgetAction } from "../../../services/budgets.js";
const DeleteBudget: React.FC = () => {
  const dispatch = useDispatch();
  const selectedBudget = useSelector(
    (state: RootState) => state.budgets.selectedBudget
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const handleDelete = async () => {
    if (!selectedBudget || !selectedBudget.id) {
      console.error("No selected pot or pot ID");
      return;
    }
    const token = isAuthenticated ? localStorage.getItem("token") : null;

    try {
      dispatch(deleteBudget(selectedBudget.id));

      if (isAuthenticated && token) {
        await deleteBudgetAction(selectedBudget.id, token);
      }
    } catch (error) {
      console.error("Error deleting pot:", error);
    }

    dispatch(closeModal());
  };
  return (
    <DeleteModal
      itemName={selectedBudget?.category || "this pot"}
      onDelete={handleDelete}
      onCancel={() => dispatch(closeModal())}
      type="budget"
    />
  );
};

export default DeleteBudget;
