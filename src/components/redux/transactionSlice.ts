import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface Transaction {
  id?: string;
  _id?: string;
  category: string;
  avatar?: string;
  date: Date | string;
  amount: number;
  name: string;
  theme?: string;
  recurring?: boolean;
}

interface TransactionState {
  transaction: Transaction[];
  selectedTransaction: Transaction | null;
  activeModal: string | null;
  loading: boolean;
  isDummyData: boolean;
  isAuthenticated: boolean;
}

const initialState: TransactionState = {
  transaction: [],
  selectedTransaction: null,
  activeModal: null,
  isAuthenticated: false,
  loading: true,
  isDummyData: false,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      const newTransaction = action.payload;
      state.transaction.push({
        ...newTransaction,
        id: newTransaction.id || newTransaction._id || uuidv4(),
        recurring: newTransaction.recurring || false,
        date:
          newTransaction.date instanceof Date
            ? newTransaction.date.toISOString()
            : newTransaction.date,
      });
    },

    editTransaction: (state, action: PayloadAction<Transaction>) => {
      const updatedTransaction = action.payload;
      const transactionIndex = state.transaction.findIndex(
        (item) =>
          item.id === updatedTransaction.id ||
          item._id === updatedTransaction.id
      );
      if (transactionIndex !== -1) {
        state.transaction[transactionIndex] = {
          ...state.transaction[transactionIndex],
          ...updatedTransaction,
        };
      } else {
        console.error("Transaction not found in transaction array.");
      }
    },

    loadTransactions: (state, action: PayloadAction<Transaction[]>) => {
      console.log(state.transaction);
      state.transaction = action.payload.map((transaction) => ({
        ...transaction,
        id: transaction.id || transaction._id || uuidv4(),
        recurring: transaction.recurring || false,
        date:
          transaction.date instanceof Date
            ? transaction.date.toISOString()
            : transaction.date,
      }));
    },

    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transaction = state.transaction.filter(
        (transaction) =>
          transaction.id !== action.payload &&
          transaction._id !== action.payload
      );
      if (
        state.selectedTransaction?.id === action.payload ||
        state.selectedTransaction?._id === action.payload
      ) {
        state.selectedTransaction = null;
      }
    },

    setSelectedTransaction(state, action: PayloadAction<string | null>) {
      const id = action.payload;
      const foundTransaction = state.transaction.find(
        (transaction) => transaction.id === id || transaction._id === id
      );
      if (!foundTransaction) {
        console.error(`Transaction with ID ${id} not found.`);
      }
      state.selectedTransaction = foundTransaction || null;
    },

    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
    setTransactionsSlice(
      state,
      action: PayloadAction<{
        transactions: Transaction[];
        isAuthenticated: boolean;
      }>
    ) {
      state.transaction = action.payload.transactions.map((transaction) => ({
        ...transaction,
        id: transaction.id || transaction._id || uuidv4(),
        recurring: transaction.recurring || false,
        date:
          transaction.date instanceof Date
            ? transaction.date.toISOString()
            : transaction.date,
      }));
      state.isAuthenticated = action.payload.isAuthenticated;
      state.loading = false;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const updatedTransaction = action.payload;
      const index = state.transaction.findIndex(
        (item) =>
          item.id === updatedTransaction.id ||
          item._id === updatedTransaction.id
      );
      if (index === -1) {
        console.error("Transaction not found for update:", updatedTransaction);
        return;
      }
      state.transaction[index] = {
        ...state.transaction[index],
        ...updatedTransaction,
      };
      if (
        state.selectedTransaction &&
        (state.selectedTransaction.id === updatedTransaction.id ||
          state.selectedTransaction._id === updatedTransaction.id)
      ) {
        state.selectedTransaction = {
          ...state.selectedTransaction,
          ...updatedTransaction,
        };
      }
    },
    resetSelectedTransaction: (state) => {
      state.selectedTransaction = null;
    },
  },
});

export const {
  openModal,
  closeModal,
  addTransaction,
  editTransaction,
  setSelectedTransaction,
  deleteTransaction,
  setTransactionsSlice,
  loadTransactions,
  setLoading,
  updateTransaction,
  resetSelectedTransaction,
} = transactionSlice.actions;

export default transactionSlice.reducer;
