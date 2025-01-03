import React, { useState, useEffect } from "react";
import datas from "../../../data.json";
import { RootState } from "../../redux/store.ts";
import { useSelector } from "react-redux";

interface PieChartProps {
  total: number;
  page?: "home" | "budget";
}

const PieChart: React.FC<PieChartProps> = ({ total, page }) => {
  const [size, setSize] = useState(300);
  const budgets = useSelector((state: RootState) => state.budgets.budgets);
  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth <= 375) {
        page === "budget" ? setSize(220) : setSize(250);
      } else if (window.innerWidth <= 600) {
        page === "budget" ? setSize(260) : setSize(170);
      } else if (window.innerWidth <= 978) {
        page === "budget" ? setSize(242) : setSize(250);
      } else {
        page === "budget" ? setSize(260) : setSize(300);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, [page]);
  let accumulatedPercentage = 0;
  const totalMaximumBudget = budgets.reduce(
    (sum, budget) => sum + budget.maximum,
    0
  );

  const currentGradientSegments = datas.budgets
    .map((budget) => {
      const { maximum, theme } = budget;
      const categoryPercentage = ((maximum / totalMaximumBudget) * 100).toFixed(
        2
      );

      if (parseFloat(categoryPercentage) > 0) {
        const segmentStart = accumulatedPercentage.toFixed(2);
        accumulatedPercentage += parseFloat(categoryPercentage);
        const segmentEnd = accumulatedPercentage.toFixed(2);

        return `${theme} ${segmentStart}% ${segmentEnd}%`;
      }
      return null;
    })
    .filter(Boolean)
    .join(", ");
  return (
    <figure
      className="pieChart"
      style={{
        minHeight: `${size}px`,
        minWidth: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        background: `
      radial-gradient(circle closest-side, rgba(255, 255, 255, 0.3) 0, rgba(255, 255, 255, 0.3) 78%, transparent 78%),
      radial-gradient(circle closest-side, white 0%, white 68%, transparent 32%),
      conic-gradient(${currentGradientSegments})
    `,
      }}
    >
      <p>
        <span>${total}</span>
        of ${totalMaximumBudget} limit
      </p>
    </figure>
  );
};

export default PieChart;
