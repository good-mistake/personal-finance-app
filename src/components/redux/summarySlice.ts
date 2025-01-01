import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const selectBudgets = (state: RootState) => state.budgets.budgets || [];
export const selectPots = (state: RootState) => state.pots.pots || [];

export const selectTransactions = (state: RootState) =>
  state.transaction.transaction || [];

export const selectCategorySpendingCurrentMonth = createSelector(
  [selectTransactions],
  (transactions) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return transactions.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.date);
      if (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      ) {
        const { category, amount } = transaction;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += Math.abs(amount);
      }
      return acc;
    }, {} as Record<string, number>);
  }
);

export const selectTotalSpentInBudgets = createSelector(
  [selectTransactions, selectBudgets],
  (transactions, budgets) => {
    if (!budgets.length || !transactions.length) return 0;

    return budgets.reduce((total, budget) => {
      const spentInCategory = transactions
        .filter(
          (transaction) =>
            transaction.category === budget.category &&
            new Date(transaction.date).getMonth() === new Date().getMonth() &&
            new Date(transaction.date).getFullYear() ===
              new Date().getFullYear()
        )
        .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
      return total + spentInCategory;
    }, 0);
  }
);

export const selectTotalSaved = createSelector(selectPots, (pots) =>
  pots.reduce((total, pot) => total + (pot.total || 0), 0)
);
export const selectFirstFourPots = createSelector(selectPots, (pots) =>
  pots.slice(0, 4)
);
export const selectTotalBudgetSaved = createSelector(selectBudgets, (budgets) =>
  budgets.reduce((total, budget) => total + (budget.maximum || 0), 0)
);

export const selectFirstFourBudgets = createSelector(selectBudgets, (budgets) =>
  budgets.slice(0, 4)
);
