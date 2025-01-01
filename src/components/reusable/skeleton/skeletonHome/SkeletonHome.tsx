import React from "react";
import "../skeleton.scss";

const SkeletonHome: React.FC = () => {
  return (
    <div className="skeleton-home">
      {/* Header */}
      <div className="skeleton-header shimmer"></div>

      {/* Top Section */}
      <div className="skeleton-top-section">
        <div className="skeleton-card shimmer"></div>
        <div className="skeleton-card shimmer"></div>
        <div className="skeleton-card shimmer"></div>
      </div>

      {/* Bottom Section */}
      <div className="skeleton-bottom-section">
        <div className="skeleton-left">
          <div className="skeleton-box shimmer"></div>
          <div className="skeleton-box shimmer"></div>
        </div>
        <div className="skeleton-right">
          <div className="skeleton-box shimmer"></div>
          <div className="skeleton-box shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonHome;
