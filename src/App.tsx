import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/pages/login/Login.tsx";
import Signup from "./components/pages/singup/Signup.tsx";
import Home from "./components/pages/home/Home.tsx";
import Pots from "./components/pages/pots/Pots.tsx";
import Transactions from "./components/pages/transactions/Transactions.tsx";
import RecurringBills from "./components/pages/recurring-bills/RecurringBills.tsx";
import Budgets from "./components/pages/budgets/Budgets.tsx";
import { PersistGate } from "redux-persist/integration/react";
import ProtectedRoutes from "./components/reusable/protectedRoute/ProtectedRoutes.tsx";
import { persistor } from "./components/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./components/redux/store.ts";
import { login, logout, setAuthLoading } from "./components/redux/userSlice";
import api from "./utils/Interceptor.ts";
import SkeletonPot from "./components/reusable/skeleton/skeletonPot/Skeleton.tsx";
import TransactionSkeleton from "./components/reusable/skeleton/skeletonTransaction/SkeletonTransaction.tsx";
import SkeletonBudget from "./components/reusable/skeleton/skeletonBudget/SkeletonBudget.tsx";
import SkeletonRec from "./components/reusable/skeleton/skeletonRec/SkeletonRec.tsx";
const App = () => {
  const dispatch = useDispatch();
  const { authLoading } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    const initializeUser = async () => {
      dispatch(setAuthLoading(true));
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(logout());
        dispatch(setAuthLoading(false));
        return;
      }
      try {
        const response = await api.get("/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        dispatch(
          login({
            name: data.user.name,
            email: data.user.email,
            pots: data.user.pots || [],
            budgets: data.user.budgets || [],
            transactions: data.user.transactions || [],
          })
        );
      } catch (err) {
        console.error("Error in verification request:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        dispatch(logout());
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    initializeUser();
  }, [dispatch]);

  return (
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/pots"
            element={authLoading ? <SkeletonPot /> : <Pots />}
          />
          <Route
            path="/transactions"
            element={authLoading ? <TransactionSkeleton /> : <Transactions />}
          />
          <Route
            path="/recurring-bills"
            element={authLoading ? <SkeletonRec /> : <RecurringBills />}
          />
          <Route
            path="/budgets"
            element={authLoading ? <SkeletonBudget /> : <Budgets />}
          />
        </Route>
      </Routes>
    </PersistGate>
  );
};

export default App;
