import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withdrawMoney, closeModal } from "../../../redux/potsSlice";
import { RootState } from "../../../redux/store.ts";
import ProgressBar from "../progressbar/ProgressBar";
import { formatCurrency } from "../../../../utils/utils.ts";
import Buttons from "../../../reusable/button/Buttons.tsx";
import { withdrawAction } from "../potService/PotService.ts";
const WithDraw = ({ onClose }) => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const selectedPot = useSelector((state: RootState) => state.pots.selectedPot);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value === "" ? "" : Math.max(0, Number(value)).toString());
    setError("");
  };

  const handleWithdraw = async () => {
    const token = isAuthenticated ? localStorage.getItem("token") : null;

    if (!amount || !selectedPot || !selectedPot.id) {
      setError("Please provide a valid amount and select a pot.");
      return;
    }

    const withdrawAmount = Number(amount);

    if (withdrawAmount > selectedPot.total) {
      setError("Insufficient funds in the pot.");
      return;
    }

    try {
      const updatedPot = {
        id: selectedPot.id,
        amount: withdrawAmount,
      };
      if (isAuthenticated && token) {
        await withdrawAction(token, updatedPot);
      }
      dispatch(withdrawMoney(updatedPot));
      dispatch(closeModal());
    } catch (error) {
      console.error("Error withdrawing from pot:", error);
      setError("Failed to withdraw money. Please try again.");
    }
  };

  const futureAmount = selectedPot
    ? selectedPot.total - (amount === "" ? 0 : Number(amount))
    : 0;
  const totalAfterWithdraw = (selectedPot?.total || 0) - Number(amount);
  return (
    <>
      <div className="modalHeader">
        <h2>Withdraw from {selectedPot?.name}</h2>
        <img src="/images/icon-close-modal.svg" alt="" onClick={onClose} />
      </div>
      <p>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus
        hendrerit. Pellentesque aliquet nibh nec urna. In nisi neque, aliquet.
      </p>
      <div className="newAmount">
        <p>New Amount</p>
        <h2>
          {Number(amount) > 0 && selectedPot
            ? `${formatCurrency(totalAfterWithdraw)} `
            : `${formatCurrency(selectedPot?.total || 0)}`}{" "}
        </h2>
      </div>
      <ProgressBar
        total={selectedPot?.total || 0}
        target={selectedPot?.target || 0}
        theme="#ff4d4f"
        futureAmount={futureAmount}
        isModalOpen={true}
      />{" "}
      <div className="amountContainer">
        <label htmlFor="amount" className="amount">
          Amount to Withdraw
        </label>
        <span className="dollarSign"></span>
        <input
          type="number"
          placeholder="0"
          value={amount}
          onChange={handleAmountChange}
        />
      </div>
      {error && <p>{error}</p>}
      <Buttons disabled={false} onClick={() => handleWithdraw()}>
        Confirm Withdrawal
      </Buttons>
    </>
  );
};

export default WithDraw;
