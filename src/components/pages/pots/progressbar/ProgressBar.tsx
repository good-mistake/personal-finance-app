import React from "react";
import "./progressbar.scss";
import { formatCurrency } from "../../../../utils/utils";
interface ProgressBarProps {
  total: number;
  target: number;
  theme: string;
  futureAmount?: number;
  isModalOpen?: boolean;
}
const ProgressBar: React.FC<ProgressBarProps> = ({
  total,
  target,
  theme,
  futureAmount,
  isModalOpen = false,
}) => {
  const currentProgress = target > 0 ? (total / target) * 100 : 0;
  const futureProgress =
    futureAmount && target > 0
      ? ((total + futureAmount) / target) * 100
      : currentProgress;
  const barColor = isModalOpen ? "rgb(32, 31, 36)" : theme;
  const futureBarColor = isModalOpen ? theme : theme;

  return (
    <div className="progressBarContainer">
      <div className="progressBar">
        <div>
          {futureAmount ? (
            <>
              <div
                className={`progressBar--fill ${
                  isModalOpen ? "openModal" : ""
                }`}
                style={{
                  width: `${currentProgress}%`,
                  backgroundColor: barColor,
                }}
              ></div>
              <div
                className="progressBar--future"
                style={{
                  width: `${futureProgress - currentProgress}%`,
                  backgroundColor: futureBarColor,
                  opacity: 0.6,
                }}
              ></div>
            </>
          ) : (
            <div
              className={`progressBar--current ${
                isModalOpen ? "openModal" : ""
              }`}
              style={{
                width: `${currentProgress}%`,
                backgroundColor: barColor,
                opacity: 0.6,
              }}
            ></div>
          )}
        </div>
      </div>
      <div className="targetAndAmount">
        <span>
          {futureAmount ? (
            <span
              style={{
                color: futureBarColor,
              }}
            >
              {futureProgress.toFixed(2)}
            </span>
          ) : (
            currentProgress.toFixed(2)
          )}
          %
        </span>
        <span>Target of {formatCurrency(target)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
