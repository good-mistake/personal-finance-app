import React from "react";
import { useSelector } from "react-redux";
import { formatCurrency } from "../../../../utils/utils";
import { useNavigate } from "react-router-dom";
import Buttons from "../../../reusable/button/Buttons";
import PieChart from "../../../reusable/pieChart/PieChart";
import { RootState } from "../../../redux/store";

const BudgetSummary = ({ budgets, transactions }) => {
  const navigate = useNavigate();

  const firstFourBudgets = budgets.slice(0, 4);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const fallbackTotal = 338;

  const calculateTotalSpentInBudgets = (transactions, budgets) => {
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
  };

  const totalSpentInBudgets = calculateTotalSpentInBudgets(
    transactions,
    budgets
  );
  const total = isAuthenticated ? totalSpentInBudgets || 0 : fallbackTotal;
  return (
    <div className="summary">
      <div className="summaryHeader">
        <h3>Budgets</h3>
        <Buttons
          variant="tertiary"
          disabled={false}
          children="See Details"
          size="large"
          onClick={() => navigate("/budgets")}
        />
      </div>
      <div className="budgetSummaryContent">
        <div className="pieChartContainer">
          <PieChart total={total} page="home" />
        </div>
        <ul>
          {firstFourBudgets.map((budget) => (
            <li key={budget.id || budget.category}>
              <div style={{ borderColor: budget.theme }}></div>
              <p>
                {budget.category} <span>{formatCurrency(budget.maximum)}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BudgetSummary;
