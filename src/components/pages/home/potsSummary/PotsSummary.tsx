import React from "react";
import { useNavigate } from "react-router-dom";

import Buttons from "../../../reusable/button/Buttons";

const PotsSummary = ({ pots }) => {
  const safePots = Array.isArray(pots) ? pots : [];

  const totalSaved = safePots.reduce((acc, pot) => acc + (pot.total || 0), 0);
  const firstFourPots = pots.slice(0, 4);
  const navigate = useNavigate();
  return (
    <div className="summary">
      <div className="summaryHeader">
        <h3>Pots</h3>
        <Buttons
          variant="tertiary"
          disabled={false}
          children="See Details"
          onClick={() => navigate("/pots")}
        />
      </div>
      <div className="potsSummaryContent">
        <div className="totalSaved">
          <img src="/images/icon-pot.svg" alt="" />
          <p>
            Total Saved
            <span>${totalSaved}</span>
          </p>
        </div>
        <div className="potsPreview">
          {firstFourPots.map((pot) => (
            <div key={`${pot.id}+${pot.name}`} className="potCard">
              <div style={{ borderColor: pot.theme }}></div>
              <p>
                {pot.name} <span> ${pot.total}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PotsSummary;
