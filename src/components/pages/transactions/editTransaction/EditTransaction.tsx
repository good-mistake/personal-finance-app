import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store.ts";
import {
  closeModal,
  updateTransaction,
  resetSelectedTransaction,
} from "../../../redux/transactionSlice.ts";
import EditModal from "../../../reusable/editModal/EditModal.tsx";
import { generateColorList } from "../../../../utils/utils.ts";
import { editTransactionAction } from "../../../services/transactions.js";
interface UpdatedData {
  category: string;
  name: string;
  amount: number;
  date: Date | any;
  theme?: string;
  recurring?: boolean;
}

const EditTransaction: React.FC = () => {
  const dispatch = useDispatch();
  const selectedTransaction = useSelector(
    (state: RootState) => state.transaction.selectedTransaction
  );

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const transactions = useSelector(
    (state: RootState) => state.transaction.transaction
  );
  const existingColors = transactions
    .map((transaction) => transaction.theme)
    .filter((color): color is string => color !== undefined);

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

  if (!selectedTransaction) {
    return null;
  }

  const handleSave = async (updatedData) => {
    if (!updatedData.date || isNaN(new Date(updatedData.date).getTime())) {
      console.error("Invalid date format");
      return;
    }

    const token = isAuthenticated ? localStorage.getItem("token") : null;
    const normalizedTransaction = {
      ...selectedTransaction,
      ...updatedData,
      theme: updatedData.theme || selectedTransaction.theme || "default-color",
    };

    try {
      if (isAuthenticated && token) {
        const updatedResponse = await editTransactionAction(
          token,
          normalizedTransaction
        );
        dispatch(updateTransaction(updatedResponse));
      } else {
        dispatch(updateTransaction(normalizedTransaction));
      }
      dispatch(closeModal());
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const hasTheme = Boolean(selectedTransaction.theme);
  const handleCancel = () => {
    dispatch(resetSelectedTransaction());
    dispatch(closeModal());
  };
  return selectedTransaction ? (
    <EditModal
      initialData={{
        name: selectedTransaction.name,
        category: selectedTransaction.category,
        amount: selectedTransaction.amount,
        date: new Date(selectedTransaction.date).toISOString().slice(0, 10),
        ...(hasTheme && { theme: selectedTransaction.theme }),
        recurring: selectedTransaction.recurring,
      }}
      categoryOptions={categoryOptions}
      colorOptions={hasTheme ? colorOptions : []}
      existingColors={hasTheme ? existingColors : []}
      onSave={(data) =>
        handleSave({ ...data, date: new Date(data.date).toISOString() })
      }
      onCancel={handleCancel}
      description="As your transactions change, feel free to update your spending limits."
    />
  ) : null;
};

export default EditTransaction;
