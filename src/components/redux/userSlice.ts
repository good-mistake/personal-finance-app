import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: {
    name: string;
    email: string;
    pots: any[];
    budgets: any[];
    transactions: any[];
  } | null;
  isAuthenticated: boolean;
  authLoading: boolean;
}
const initialState: UserState = {
  user: null,

  isAuthenticated: false,
  authLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        pots: any[];
        budgets: any[];
        transactions: any[];
      }>
    ) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.authLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.authLoading = false;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.authLoading = action.payload;
    },
  },
});
export const { login, logout, setAuthLoading } = userSlice.actions;
export default userSlice.reducer;
