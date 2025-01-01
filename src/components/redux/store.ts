import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import userReducer from "./userSlice";
import potsReducer from "./potsSlice";
import budgetsReducer from "./budgetSlice";
import transactionReducer from "./transactionSlice";

const persistConfig = {
  key: "root", // Key in localStorage
  storage, // Storage type (localStorage)
  whitelist: ["user", "pots", "budgets", "transaction"], // State slices to persist
};
const rootReducer = combineReducers({
  user: userReducer,
  pots: potsReducer,
  budgets: budgetsReducer,
  transaction: transactionReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
