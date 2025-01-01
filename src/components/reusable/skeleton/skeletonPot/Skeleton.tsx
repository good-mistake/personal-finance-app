import React from "react";
import "../skeleton.scss";

const SkeletonPot = () => {
  return (
    <div className="skeletonPot">
      <div className="skeletonPotHeader">
        <div className="circle"></div>
        <div className="title"></div>
      </div>
      <div className="skeletonPotContent">
        <div className="totalSaved">
          <div className="label"></div>
          <div className="amount"></div>
        </div>
        <div className="progressBar"></div>
      </div>
      <div className="skeletonPotFooter">
        <div className="button"></div>
        <div className="button"></div>
      </div>
    </div>
  );
};

export default SkeletonPot;
