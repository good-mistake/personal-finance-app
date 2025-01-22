import React, { useEffect } from "react";
import Sidebar from "../../reusable/sidebar/Sidebar.tsx";
import "./home.scss";
import datas from "../../../data.json";
import { formatCurrency } from "../../../utils/utils.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PotsSummary from "./potsSummary/PotsSummary.tsx";
import BudgetSummary from "./budgetSummary/BudgetSummary.tsx";
import TransactionSummary from "./transactionSummary/TransactionSummary.tsx";
import RecurringBillsSummary from "./recurringBillSummary/BillsSummary.tsx";
import SkeletonHome from "../../reusable/skeleton/skeletonHome/SkeletonHome.tsx";
import { setLoading, setPots } from "../../redux/potsSlice";
import { setBudgets } from "../../redux/budgetSlice";
import { setTransactionsSlice } from "../../redux/transactionSlice.ts";
import useMediaQuery from "../../../utils/useMediaQuery.tsx";
import { fetchTransaction } from "../../services/transactions.js";
import { fetchBudgets } from "../../services/budgets.js";
import { fetchPots } from "../../services/pots.js";
const Home: React.FC = () => {
  const dispatch = useDispatch();
  const today = new Date();
  const { user, isAuthenticated, authLoading } = useSelector(
    (state: RootState) => state.user
  );
  const isMobile = useMediaQuery("mobile");
  const isTablet = useMediaQuery("tablet");
  const sidebarVariant = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
  const { pots, loading } = useSelector((state: RootState) => state.pots);
  const { budgets } = useSelector((state: RootState) => state.budgets);
  const transactions = useSelector((state: RootState) => state.transaction);
  useEffect(() => {
    const fetchAndSetPots = async () => {
      dispatch(setLoading(true));

      if (isAuthenticated && user) {
        try {
          const token = localStorage.getItem("token") || "";

          const [potsData, budgetsData, transactionsData] = await Promise.all([
            fetchPots(token),
            fetchBudgets(token),
            fetchTransaction(token),
          ]);
          dispatch(setPots({ pots: potsData, isAuthenticated: true }));
          dispatch(setBudgets({ budgets: budgetsData, isAuthenticated: true }));
          dispatch(
            setTransactionsSlice({
              transactions: transactionsData,
              isAuthenticated: true,
            })
          );
        } catch (error) {
          console.error("Error fetching pots:", error);
        }
      } else {
        dispatch(setPots({ pots: datas.pots, isAuthenticated: false }));
        dispatch(
          setBudgets({ budgets: datas.budgets, isAuthenticated: false })
        );
        dispatch(
          setTransactionsSlice({
            transactions: datas.transactions,
            isAuthenticated: false,
          })
        );
      }

      dispatch(setLoading(false));
    };

    fetchAndSetPots();
  }, [isAuthenticated, user, dispatch]);
  let paidTotal = 0;
  let dueSoonTotal = 0;
  let upcomingTotal = 0;
  let paidCount = 0;
  let dueSoonCount = 0;
  let upcomingCount = 0;

  transactions.transaction
    .filter((e) => e.recurring)
    .forEach((bill) => {
      const billDate = new Date(bill.date).getDate();
      const todayDate = today.getDate();

      if (billDate < todayDate) {
        paidTotal += Math.abs(bill.amount);
        paidCount++;
      } else {
        upcomingTotal += Math.abs(bill.amount);
        upcomingCount++;

        if (billDate <= todayDate + 5) {
          dueSoonTotal += Math.abs(bill.amount);
          dueSoonCount++;
        }
      }
    });
  const income = transactions.transaction

    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.transaction

    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const currentBalance = income - expenses;
  console.log("Pots:", pots);
  console.log("Budgets:", budgets);
  console.log("Transactions:", transactions.transaction);
  console.log("Is Authenticated:", isAuthenticated);

  return (
    <div className={`homeContainer `}>
      <Sidebar variant={sidebarVariant} position="right">
        {authLoading || loading ? (
          <SkeletonHome />
        ) : (
          <main>
            <h1>Overview</h1>
            <section className="topSection">
              <div className="balance">
                <h5>Current Balance</h5>
                <h3>
                  {formatCurrency(
                    isAuthenticated ? currentBalance : datas.balance.current
                  )}
                </h3>
              </div>
              <div className="income">
                <h5>Income</h5>
                <h3>
                  {formatCurrency(
                    isAuthenticated ? income : datas.balance.income
                  )}
                </h3>
              </div>
              <div className="expenses">
                <h5>Expenses</h5>
                <h3>
                  {formatCurrency(
                    isAuthenticated ? expenses : datas.balance.expenses
                  )}
                </h3>
              </div>
            </section>
            <section className="bottomSection">
              <div className="left">
                <div className="potsSummary">
                  <PotsSummary pots={pots} />
                </div>
                <div className="transactionSummary">
                  <TransactionSummary
                    transactions={
                      isAuthenticated
                        ? user?.transactions || []
                        : datas.transactions
                    }
                  />
                </div>
              </div>
              <div className="right">
                <div className="budgetsSummary">
                  <BudgetSummary
                    budgets={budgets}
                    transactions={transactions.transaction}
                  />
                </div>
                <div className="recurringBillsSummary">
                  <RecurringBillsSummary
                    paidTotal={paidTotal}
                    dueSoonTotal={dueSoonTotal}
                    upcomingTotal={upcomingTotal}
                    paidCount={paidCount}
                    dueSoonCount={dueSoonCount}
                    upcomingCount={upcomingCount}
                  />{" "}
                </div>
              </div>
            </section>
          </main>
        )}
      </Sidebar>
    </div>
  );
};

export default Home;
