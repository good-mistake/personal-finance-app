import React from "react";
import AddModal from "../../../reusable/AddModal/AddModal.tsx";
import { useDispatch, useSelector } from "react-redux";
import { addTransaction } from "../../../redux/transactionSlice.ts";
import { RootState } from "../../../redux/store";

const AddTransaction: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useDispatch();
  const transactions = useSelector((state: RootState) => state.pots.pots);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const API_URL = `https://personal-finance-app-git-main-goodmistakes-projects.vercel.app/api/transactions`;

  const handleSave = async (newTransaction) => {
    const { name, amount, category, date, theme, recurring } = newTransaction;

    if (
      !name ||
      !amount ||
      !category ||
      !date ||
      !theme ||
      recurring === undefined
    ) {
      console.error("Missing required fields");
      return;
    }
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category: newTransaction.category,
            amount: newTransaction.amount,
            theme: newTransaction.theme,
            name: newTransaction.name,
            date: newTransaction.date,
            recurring: newTransaction.recurring,
          }),
        });
        console.log("Payload:", {
          category: newTransaction.category,
          amount: newTransaction.amount,
          theme: newTransaction.theme,
          name: newTransaction.name,
          date: newTransaction.date,
          recurring: newTransaction.recurring,
        });
        if (!response.ok) {
          throw new Error("Failed to save Transaction");
        }

        const savedTransaction = await response.json();
        dispatch(addTransaction(savedTransaction));
      } catch (error) {
        console.error("Error adding Transaction:", error);
        console.log("Payload:", {
          category: newTransaction.category,
          amount: newTransaction.amount,
          theme: newTransaction.theme,
          name: newTransaction.name,
          date: newTransaction.date,
          recurring: newTransaction.recurring,
        });
      }
    } else {
      dispatch(addTransaction(newTransaction));
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
      title="Add New Transaction"
      description="Choose a category to set for a transaction. These categories can help you monitor transaction."
      onSave={handleSave}
      onClose={onClose}
      existingItems={transactions}
      type="transaction"
      categoryOptions={categoryOptions}
    />
  );
};

export default AddTransaction;
