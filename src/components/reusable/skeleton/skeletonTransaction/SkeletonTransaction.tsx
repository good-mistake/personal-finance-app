import React from "react";
import "../skeleton.scss";

const TransactionSkeleton = () => {
  return (
    <div className="transactionContainer">
      <div className="transactionHeader skeleton">
        <div className="skeleton-heading"></div>
        <div className="skeleton-button"></div>
      </div>
      <div className="transactions">
        <div className="searchAndFilters">
          <div className="skeleton-search"></div>
          <div className="filters">
            <div className="skeleton-filter"></div>
            <div className="skeleton-filter"></div>
          </div>
        </div>
        <div className="details">
          <ul>
            {[...Array(5)].map((_, index) => (
              <li key={index} className="skeleton-transaction">
                <div className="skeleton-name shimmer"></div>
                <div className="skeleton-category shimmer"></div>
                <div className="skeleton-date shimmer"></div>
                <div className="skeleton-amount shimmer"></div>
              </li>
            ))}
          </ul>
        </div>
        <div className="skeleton-pagination"></div>
      </div>
    </div>
  );
};

export default TransactionSkeleton;
