import React from "react";
import { formatCurrency, formatDate } from "../../../../utils/utils";
import { useNavigate } from "react-router-dom";
import Buttons from "../../../reusable/button/Buttons";
const TransactionSummary = ({ transactions }) => {
  const navigate = useNavigate();
  const sortedTransactions = [...transactions]?.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const summaryTransactions = sortedTransactions.slice(0, 5);

  return (
    <div className="summary">
      <div className="summaryHeader">
        <h3>Transactions</h3>
        <Buttons
          variant="tertiary"
          disabled={false}
          children="View All"
          onClick={() => navigate("/pots")}
        />
      </div>
      <ul>
        {summaryTransactions.map((transaction) => (
          <li key={`${transaction._id}+${transaction.name}`}>
            <div className="nameAndImg">
              {transaction.avatar ? (
                <img
                  src={transaction.avatar.replace(/^\.\/assets/, "")}
                  alt={transaction.name || "Transaction"}
                />
              ) : (
                <div
                  className="transactionAvatarColor"
                  style={{
                    backgroundColor: transaction.theme || "#ccc",
                  }}
                ></div>
              )}
              <h4>{transaction.name}</h4>
            </div>
            <div className="amountAndDate">
              <p
                className={`amount ${
                  transaction.amount < 0 ? "negative" : "positive"
                }`}
              >
                {transaction.amount > 0 && "+"}
                {formatCurrency(transaction.amount)}
              </p>
              <p>{formatDate(transaction.date)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionSummary;
