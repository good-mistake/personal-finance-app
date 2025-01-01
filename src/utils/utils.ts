export const isValidHex = (color: string): boolean =>
  /^#[0-9A-F]{6}$/i.test(color);

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDueDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";
  return `Monthly-${day}${suffix}`;
};

type Dispatch = (action: any) => void;

export const handleAddMoney = (
  amount: number,
  selectedPot: any | null,
  dispatch: Dispatch,
  updatePotTotal: (data: { id: string; amount: number }) => void,
  closeAddMoneyModal: () => void
) => {
  if (selectedPot && amount > 0) {
    dispatch(updatePotTotal({ id: selectedPot.id, amount }));
    dispatch(closeAddMoneyModal());
  }
};
export const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const generateColorList = (
  existingColors: string[],
  limit: number = 30
): string[] => {
  const colors = new Set(existingColors.filter(isValidHex));
  while (colors.size < limit) {
    colors.add(generateRandomColor());
  }
  return Array.from(colors);
};
export const getGradientSegments = (
  budgets: { maximum: number; theme: string }[]
): string => {
  let accumulatedPercentage = 0;

  const totalMax = budgets.reduce(
    (sum: number, budget) => sum + budget.maximum,
    0
  );

  return budgets
    .map((budget) => {
      const { maximum, theme } = budget;
      const percentage = ((maximum / totalMax) * 100).toFixed(2);
      if (parseFloat(percentage) > 0) {
        const start = accumulatedPercentage.toFixed(2);
        accumulatedPercentage += parseFloat(percentage);
        const end = accumulatedPercentage.toFixed(2);
        return `${theme} ${start}% ${end}%`;
      }
      return null;
    })
    .filter(Boolean)
    .join(", ");
};
export const getBudgetSummary = (
  budgets: { category: string; theme: string; maximum: number }[],
  limit: number = 4
): { category: string; theme: string; maximum: number }[] =>
  budgets.slice(0, limit).map((budget) => ({
    category: budget.category,
    theme: budget.theme,
    maximum: budget.maximum,
  }));
export const calculateTotalSpending = (transactions: any[]) =>
  transactions.reduce(
    (sum, transaction) =>
      transaction.amount < 0 ? sum + Math.abs(transaction.amount) : sum,
    0
  );

export const toggleDropdown = (id: string, setDropdownState: any) => {
  setDropdownState((prev: any) => {
    const newState: Record<string, boolean> = {};
    Object.keys(prev).forEach((key) => {
      newState[key] = false;
    });
    newState[id] = !prev[id];
    return newState;
  });
};
export const isModalOpen = (state: any, modalType: string): boolean =>
  state.activeModal === modalType;

export const calculateTotalSpent = (transactions: any[], budgets: any[]) => {
  const categorySpending = transactions.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += Math.abs(amount);
    return acc;
  }, {});

  return budgets.reduce((total, budget) => {
    const spent = categorySpending[budget.category] || 0;
    return total + spent;
  }, 0);
};
