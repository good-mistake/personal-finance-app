import React from "react";

const SkeletonRec = () => {
  return (
    <div className="skeletonReccontainer">
      <div className="skeletonHeader">
        <div className="skeletonTitle skeleton"></div>
        <div className="skeletonSubtitle skeleton"></div>
      </div>
      <div className="skeletonBills">
        {[...Array(10)].map((_, index) => (
          <div className="skeletonBill" key={index}>
            <div className="skeletonName skeleton"></div>
            <div className="skeletonDate skeleton"></div>
            <div className="skeletonAmount skeleton"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonRec;
