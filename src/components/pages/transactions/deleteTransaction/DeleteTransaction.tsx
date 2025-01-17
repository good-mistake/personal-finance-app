import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store.ts";
import {
  deleteTransaction,
  closeModal,
} from "../../../redux/transactionSlice.ts";
import DeleteModal from "../../../reusable/deleteModal/DeleteModal.tsx";
import { deleteTransactionAction } from "../../../services/transactions.js";
const DeleteTransaction: React.FC = () => {
  const dispatch = useDispatch();
  const selectedTransaction = useSelector(
    (state: RootState) => state.transaction.selectedTransaction
  );

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const handleDelete = async () => {
    if (!selectedTransaction || !selectedTransaction.id) {
      console.error("No selected transaction or transaction ID");
      return;
    }
    const token = isAuthenticated ? localStorage.getItem("token") : null;

    try {
      if (isAuthenticated && token) {
        await deleteTransactionAction(selectedTransaction.id, token);
      }
      dispatch(deleteTransaction(selectedTransaction.id));
      dispatch(closeModal());
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <DeleteModal
      itemName={selectedTransaction?.name || "this pot"}
      onDelete={handleDelete}
      onCancel={() => dispatch(closeModal())}
      type="transaction"
    />
  );
};

export default DeleteTransaction;
