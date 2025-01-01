import React from "react";
import "../skeleton.scss";

const SkeletonBudget = () => {
  return (
    <div className="budgetContainerSkeleton">
      <div className="budgetHeaderSkeleton">
        <div className="skeleton headerSkeleton"></div>
        <div className="skeleton buttonSkeleton"></div>
      </div>
      <div className="budgetContentSkeleton">
        <div className="leftSkeleton">
          <div className="skeleton pieChartSkeleton"></div>
          <div className="summarySkeleton">
            <div className="skeleton summaryLine"></div>
            <div className="skeleton summaryLine"></div>
          </div>
        </div>
        <div className="rightSkeleton">
          <div className="categorySkeleton">
            <div className="skeleton headerSkeleton"></div>
            <div className="skeleton lineSkeleton"></div>
            <div className="spentRemainSkeleton">
              <div className="skeleton themeSkeleton"></div>
              <div className="skeleton textSkeleton"></div>
            </div>
          </div>
          <div className="transactionListSkeleton">
            <div className="skeleton transactionSkeleton"></div>
            <div className="skeleton transactionSkeleton"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SkeletonBudget;
