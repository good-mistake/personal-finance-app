import React, { useState, useEffect } from "react";
import Sidebar from "../../reusable/sidebar/Sidebar";
import Buttons from "../../reusable/button/Buttons";
import datas from "../../../data.json";
import { v4 as uuidv4 } from "uuid";
import "./budgets.scss";
import "./dropDownbudget/DropDownBudget.tsx";
import { formatCurrency, formatDate } from "../../../utils/utils";
import DropDownBudget from "./dropDownbudget/DropDownBudget.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store.ts";
import {
  openModal,
  setBudgets,
  setLoading,
  setTotalSpentInBudgets,
} from "../../redux/budgetSlice.ts";
import BudgetModalManager from "./budgetModalManaget/BudgetModalManager.tsx";
import PieChart from "../../reusable/pieChart/PieChart.tsx";
import {
  fetchBudgets,
  fetchTransactionsFromBackend,
} from "./budgetsService/BudgetsService.ts";
import { useCallback } from "react";
import SkeletonBudget from "../../reusable/skeleton/skeletonBudget/SkeletonBudget.tsx";
import { setAuthLoading } from "../../redux/userSlice.ts";
import useMediaQuery from "../../../utils/useMediaQuery.tsx";
const Budgets: React.FC = () => {
  const dispatch = useDispatch();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const isMobile = useMediaQuery("mobile");
  const isTablet = useMediaQuery("tablet");
  const sidebarVariant = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
  const august2024Month = 7;
  const august2024Year = 2024;
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState<
    any[]
  >([]);

  const { isAuthenticated, authLoading } = useSelector(
    (state: RootState) => state.user
  );
  const budgets = useSelector((state: RootState) => state.budgets.budgets);
  const loading = useSelector((state: RootState) => state.budgets.loading);

  const fetchTransactions = useCallback(async (): Promise<any[]> => {
    if (!isAuthenticated) {
      return datas.transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getMonth() === august2024Month &&
          transactionDate.getFullYear() === august2024Year
        );
      });
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token missing for authenticated user");

      const transactions = await fetchTransactionsFromBackend(token);
      return transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  }, [isAuthenticated, currentMonth, currentYear]);

  useEffect(() => {
    const fetchAllData = async () => {
      dispatch(setLoading(true));

      try {
        if (!authLoading) {
          if (isAuthenticated) {
            const budgetsData = await fetchBudgets(
              localStorage.getItem("token")!
            );
            dispatch(
              setBudgets({ budgets: budgetsData, isAuthenticated: true })
            );

            const transactions = await fetchTransactions();
            setCurrentMonthTransactions(transactions);

            const totalSpent = budgetsData.reduce((acc, budget) => {
              const spent = transactions
                .filter(
                  (transaction) => transaction.category === budget.category
                )
                .reduce(
                  (sum, transaction) => sum + Math.abs(transaction.amount),
                  0
                );
              return acc + spent;
            }, 0);
            dispatch(setTotalSpentInBudgets(totalSpent));
          } else {
            dispatch(setAuthLoading(false));

            const budgetsWithIds = datas.budgets.map((budget) => ({
              ...budget,
              id: uuidv4(),
            }));
            dispatch(
              setBudgets({ budgets: budgetsWithIds, isAuthenticated: false })
            );

            const transactions = await fetchTransactions();
            setCurrentMonthTransactions(transactions);
          }
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        dispatch(setLoading(false));
        dispatch(setAuthLoading(false));
      }
    };

    fetchAllData();
  }, [dispatch, isAuthenticated, authLoading, fetchTransactions]);

  const categorySpendingCurrentMonth = currentMonthTransactions.reduce(
    (acc, transaction) => {
      const { category, amount } = transaction;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Math.abs(amount);
      return acc;
    },
    {} as Record<string, number>
  );

  const currentMonthBudgets = budgets.map((budget) => {
    const { category, theme, maximum, id } = budget;
    const spentInCurrentMonth = categorySpendingCurrentMonth[category] || 0;
    const remainingInCurrentMonth = maximum - spentInCurrentMonth;

    return {
      category,
      maximum,
      spentInCurrentMonth,
      theme,
      remainingInCurrentMonth,
      id,
    };
  });

  const totalSpentInBudgets = currentMonthBudgets.reduce(
    (acc, budget) => acc + budget.spentInCurrentMonth,
    0
  );

  const currentMonthBudgetsMap = new Map(
    currentMonthBudgets.map((budget) => [budget.category, budget])
  );

  const parseDate = (dateString: string): Date | null => {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };
  const getAllTransactionsSorted = (category: string, transactions: any[]) => {
    return transactions
      .filter((transaction) => transaction.category === category)
      .sort((a, b) => {
        const parsedDateA = parseDate(a.date);
        const parsedDateB = parseDate(b.date);
        return parsedDateB!.getTime() - parsedDateA!.getTime();
      });
  };

  const handleToggleExpand = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const safeBudgets = budgets || [];

  return (
    <div className="budgetContainer">
      <Sidebar variant={sidebarVariant} position="left">
        {authLoading ||
        loading ||
        !currentMonthBudgets.length ||
        !currentMonthTransactions.length ? (
          <SkeletonBudget />
        ) : (
          <>
            <div className="budgetHeader">
              <h3>
                Budgets {!isMobile && "for  "}
                {!isMobile ? (
                  isAuthenticated ? (
                    new Date().toLocaleString("default", { month: "long" })
                  ) : (
                    "August 2024"
                  )
                ) : (
                  <span>
                    {isAuthenticated
                      ? new Date().toLocaleString("default", { month: "long" })
                      : "August 2024"}
                  </span>
                )}
              </h3>
              <Buttons
                variant="primary"
                disabled={false}
                size="large"
                onClick={() => dispatch(openModal("addBudget"))}
              >
                + Add New Budget
              </Buttons>
            </div>
            <p>{error}</p>

            <div className="budgetContent">
              <div className="left">
                <PieChart total={totalSpentInBudgets} page="budget" />
                <div className="budgetSummaryInfo">
                  <h3>Spending Summary</h3>
                  {currentMonthBudgets.map((budget) => (
                    <div
                      key={budget.id}
                      className="budgetSummaryInfoContent"
                      style={{ borderColor: budget.theme }}
                    >
                      <p className="name">{budget.category}</p>
                      <div className="amounts">
                        <span>
                          {formatCurrency(budget.spentInCurrentMonth)}
                        </span>
                        of
                        {formatCurrency(budget.maximum)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="right">
                {safeBudgets.map((budget) => {
                  const transactions = getAllTransactionsSorted(
                    budget.category,
                    currentMonthTransactions
                  );
                  const showAll = expandedCategory === budget.category;
                  const displayedTransactions = showAll
                    ? transactions
                    : transactions.slice(0, 3);

                  const spent =
                    currentMonthBudgetsMap.get(budget.category)
                      ?.spentInCurrentMonth || 0;

                  return (
                    <div key={budget.id} className="categoryTransactions">
                      <div className="categoryHeader">
                        <div className="nameAndColor">
                          <div style={{ backgroundColor: budget.theme }}></div>
                          {budget.category}
                        </div>
                        <DropDownBudget
                          budgetId={budget.id || `${budget._id}`}
                        />
                      </div>

                      <div className="categorySpent">
                        <div className="max">
                          Maximum of {formatCurrency(budget.maximum)}
                        </div>
                        <div className="line">
                          <div
                            style={{
                              backgroundColor: budget.theme,
                              width:
                                Math.min(
                                  Math.round(
                                    (currentMonthBudgetsMap.get(budget.category)
                                      ?.spentInCurrentMonth! /
                                      budget.maximum) *
                                      100
                                  ),
                                  100
                                ) + "%",
                            }}
                          ></div>
                        </div>{" "}
                        <div className="spentAndRemain">
                          <div className="spent">
                            <div
                              className="theme"
                              style={{ borderColor: budget.theme }}
                            ></div>
                            <div>
                              <p className="title">Spent</p>
                              <p className="amount">{formatCurrency(spent)}</p>
                            </div>
                          </div>
                          <div className="remain">
                            <div className="themeRemain"></div>
                            <div>
                              <p className="title">Remaining</p>
                              <p className="amount">
                                {formatCurrency(budget.maximum - spent)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="transactionList">
                        <div className="listHeader">
                          <h4> Latest Spending</h4>
                          {transactions.length > 3 && (
                            <Buttons
                              disabled={false}
                              variant="tertiary"
                              onClick={() =>
                                handleToggleExpand(budget.category)
                              }
                            >
                              {showAll ? "See Less" : "See All"}
                            </Buttons>
                          )}
                        </div>
                        {displayedTransactions.map((transaction) => (
                          <div
                            key={`${transaction.date}-${transaction.amount} `}
                            className="transactionItem"
                          >
                            <div className="transactionInfo">
                              <div className="nameAndPic">
                                {transaction.avatar ? (
                                  <img
                                    src={transaction.avatar.replace(
                                      /^\.\/assets/,
                                      ""
                                    )}
                                    alt={transaction.name || "Transaction"}
                                  />
                                ) : (
                                  <div
                                    className="transactionAvatarColor"
                                    style={{
                                      backgroundColor:
                                        transaction.theme || "#ccc",
                                    }}
                                  ></div>
                                )}

                                <p>{transaction.name}</p>
                              </div>
                              <div className="dateAndAmount">
                                <span>
                                  {formatCurrency(transaction.amount)}
                                </span>
                                <span>{formatDate(transaction.date)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </Sidebar>
      <BudgetModalManager />
    </div>
  );
};

export default Budgets;
