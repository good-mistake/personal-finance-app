import React from "react";
import { useNavigate } from "react-router-dom";
import Buttons from "../../../reusable/button/Buttons";
interface RecurringBillsSummaryProps {
  paidTotal: number;
  dueSoonTotal: number;
  upcomingTotal: number;
  paidCount: number;
  dueSoonCount: number;
  upcomingCount: number;
}
const RecurringBillsSummary: React.FC<RecurringBillsSummaryProps> = ({
  paidTotal,
  dueSoonTotal,
  upcomingTotal,
  paidCount,
  dueSoonCount,
  upcomingCount,
}) => {
  const navigate = useNavigate();

  return (
    <div className="summary">
      <div className="summaryHeader">
        <h3>Recurring Bills</h3>
        <Buttons
          variant="tertiary"
          disabled={false}
          children="See Details"
          onClick={() => navigate("/recurring-bills")}
        />
      </div>
      <div className="summaryContent">
        <p className="paid">
          Paid Bills
          <span>${paidTotal}</span>
        </p>
        <p className="upcoming">
          Total Upcoming
          <span>${upcomingTotal}</span>
        </p>
        <p className="soon">
          Due Soon
          <span>${dueSoonTotal}</span>
        </p>
      </div>
    </div>
  );
};

export default RecurringBillsSummary;
