import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Budget {
  id?: string;
  _id?: string;
  category: string;
  maximum: number;
  theme: string;
}
interface BudgetsState {
  budgets: Budget[];
  selectedBudget: Budget | null;
  isModalOpen: boolean;
  activeModal: string | null;
  loading: boolean;
  isDummyData: boolean;
  isAuthenticated: boolean;
  totalSpentInBudgets: number;
}

const initialState: BudgetsState = {
  budgets: [],
  selectedBudget: null,
  isModalOpen: false,
  activeModal: null,
  isAuthenticated: false,
  loading: true,
  isDummyData: false,
  totalSpentInBudgets: 0,
};

const budgetsSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {
    addBudget: (state, action: PayloadAction<Budget>) => {
      state.budgets.push(action.payload);
    },
    editBudget: (state, action: PayloadAction<any>) => {
      const budgetIndex = state.budgets.findIndex(
        (budget) =>
          budget.id === action.payload.id || budget._id === action.payload.id
      );

      if (budgetIndex !== -1) {
        state.budgets[budgetIndex] = {
          ...state.budgets[budgetIndex],
          ...action.payload,
        };
        if (
          state.selectedBudget?.id === action.payload.id ||
          state.selectedBudget?._id === action.payload.id
        ) {
          state.selectedBudget = {
            ...state.selectedBudget,
            ...action.payload,
          };
        }
      }
    },
    loadBudgets: (state, action) => {
      state.budgets = action.payload;
    },
    deleteBudget: (state, action: PayloadAction<string>) => {
      state.budgets = state.budgets.filter(
        (budget) => budget.id !== action.payload
      );
      if (state.selectedBudget?.id === action.payload) {
        state.selectedBudget = null;
      }
    },
    setSelectedBudget(state, action: PayloadAction<string>) {
      state.selectedBudget =
        state.budgets.find(
          (budget) =>
            budget.id === action.payload || budget._id === action.payload
        ) || null;
    },
    openModal: (state, action) => {
      state.activeModal = action.payload;
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.isModalOpen = false;
    },
    setBudgets(
      state,
      action: PayloadAction<{ budgets: Budget[]; isAuthenticated: boolean }>
    ) {
      state.budgets = action.payload.budgets;
      state.loading = false;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateBudget: (state, action) => {
      const updatedBudget = action.payload;
      const index = state.budgets.findIndex((b) => b.id === updatedBudget.id);

      if (index === -1) {
        console.error("Budget not found for update:", updatedBudget);
        return;
      }

      state.budgets[index] = updatedBudget;
    },
    resetSelectedBudget: (state) => {
      state.selectedBudget = null;
    },
    setTotalSpentInBudgets: (state, action) => {
      state.totalSpentInBudgets = action.payload;
    },
  },
});
export const {
  openModal,
  closeModal,
  addBudget,
  editBudget,
  setSelectedBudget,
  deleteBudget,
  setBudgets,
  loadBudgets,
  setLoading,
  updateBudget,
  resetSelectedBudget,
  setTotalSpentInBudgets,
} = budgetsSlice.actions;

export default budgetsSlice.reducer;
