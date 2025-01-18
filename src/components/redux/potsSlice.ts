import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Pot {
  id: string;
  _id?: string;
  name: string;
  target: number;
  total: number;
  theme: string;
}

interface PotsState {
  pots: Pot[];
  selectedPot: Pot | null;
  activeModal: string | null;
  loading: boolean;
  isModalOpen: boolean;
  isDummyData: boolean;
}

const initialState: PotsState = {
  pots: [],
  selectedPot: null,
  activeModal: null,
  loading: true,
  isModalOpen: false,
  isDummyData: false,
};

const potsSlice = createSlice({
  name: "pots",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.activeModal = action.payload;
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.isModalOpen = false;
    },
    updatePot: (state, action) => {
      const { potId, updatedData } = action.payload;
      state.pots = state.pots.map((pot) =>
        pot.id === potId || pot._id === potId ? { ...pot, ...updatedData } : pot
      );
    },
    updatePotTotal: (
      state,
      action: PayloadAction<{ id: string; amount: number }>
    ) => {
      state.pots = state.pots.map((pot) =>
        pot.id === action.payload.id || pot._id === action.payload.id
          ? { ...pot, total: pot.total + action.payload.amount }
          : pot
      );
    },
    updatePotTarget: (
      state,
      action: PayloadAction<{ id: string; amount: number }>
    ) => {
      const pot = state.pots.find(
        (e) => e.id === action.payload.id || e._id === action.payload.id
      );
      if (pot) {
        pot.target = action.payload.amount;
      }
    },
    withdrawMoney: (
      state,
      action: PayloadAction<{ id: string; amount: number }>
    ) => {
      const pot = state.pots.find(
        (e) => e.id === action.payload.id || e._id === action.payload.id
      );
      if (pot) {
        pot.total -= action.payload.amount;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPots: (
      state,
      action: PayloadAction<{ pots: Pot[]; isAuthenticated: boolean }>
    ) => {
      state.pots = action.payload.pots;
      state.loading = false;
      state.isDummyData = !action.payload.isAuthenticated;
    },
    addPot: (state, action: PayloadAction<Pot>) => {
      state.pots.push(action.payload);
    },
    setSelectedPot: (state, action: PayloadAction<string>) => {
      state.selectedPot =
        state.pots.find(
          (pot) => pot.id === action.payload || pot._id === action.payload
        ) || null;
    },
    editPot: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        target: number;
        theme: string;
      }>
    ) => {
      const potIndex = state.pots.findIndex(
        (pot) => pot.id === action.payload.id || pot._id === action.payload.id
      );
      if (potIndex !== -1) {
        state.pots[potIndex] = {
          ...state.pots[potIndex],
          name: action.payload.name,
          target: action.payload.target,
          theme: action.payload.theme,
        };
      }
    },
    deletePot: (state, action: PayloadAction<string>) => {
      state.pots = state.pots.filter(
        (pot) => pot.id !== action.payload && pot._id !== action.payload
      );
      if (
        state.selectedPot?.id === action.payload ||
        state.selectedPot?._id === action.payload
      ) {
        state.selectedPot = null;
      }
    },
    loadPots: (state, action: PayloadAction<Pot[]>) => {
      state.pots = action.payload;
    },
    resetSelectedPot: (state) => {
      state.selectedPot = null;
    },
  },
});

export const {
  updatePotTotal,
  withdrawMoney,
  setPots,
  addPot,
  setSelectedPot,
  editPot,
  deletePot,
  openModal,
  closeModal,
  loadPots,
  setLoading,
  updatePotTarget,
  updatePot,
  resetSelectedPot,
} = potsSlice.actions;

export default potsSlice.reducer;
