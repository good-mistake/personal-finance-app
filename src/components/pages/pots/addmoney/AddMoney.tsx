import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePotTotal } from "../../../redux/potsSlice";
import { RootState } from "../../../redux/store.ts";
import ProgressBar from "../progressbar/ProgressBar.tsx";
import Buttons from "../../../reusable/button/Buttons.tsx";
import { formatCurrency } from "../../../../utils/utils.ts";
import { addMoneyAction } from "../../../services/pots.js";

const AddMoney = ({ onClose }) => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState<string | number>("");
  const selectedPot = useSelector((state: RootState) => state.pots.selectedPot);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const [error, setError] = useState("");

  const handleConfirmAddition = async () => {
    if (!selectedPot || !selectedPot.id) {
      setError("Pot is not selected or ID is missing.");
      return;
    }
    if (typeof amount === "number" && amount > 0) {
      const updatedPot = {
        id: selectedPot.id,
        amount: Number(amount),
      };
      try {
        if (isAuthenticated) {
          const token = localStorage.getItem("token");
          if (token) {
            await addMoneyAction(token, updatedPot);
          }
        }
        dispatch(
          updatePotTotal({ id: selectedPot.id, amount: Number(amount) })
        );
        onClose();
      } catch (error) {
        console.error("Failed to add money:", error);
      }
    } else {
      setError("Amount must be a valid positive number.");
    }
  };

  const totalAfterAdd = (selectedPot?.total || 0) + Number(amount);

  return (
    <>
      <div className="modalHeader">
        <h2>Add to ‘{selectedPot?.name}’</h2>
        <img src="/images/icon-close-modal.svg" alt="" onClick={onClose} />
      </div>
      <p>
        Add money to your pot to keep it separate from your main balance. As
        soon as you add this money, it will be deducted from your current
        balance.
      </p>
      <div className="newAmount">
        <p>New Amount</p>
        <h2>
          {Number(amount) > 0 && selectedPot
            ? `${formatCurrency(totalAfterAdd)} `
            : `${formatCurrency(selectedPot?.total || 0)} `}
        </h2>
      </div>
      {selectedPot && (
        <ProgressBar
          total={selectedPot.total || 0}
          target={selectedPot.target || 0}
          theme={selectedPot.theme}
          futureAmount={typeof amount === "number" ? amount : 0}
          isModalOpen={true}
        />
      )}
      <div className="amountContainer">
        <label htmlFor="amount" className="amount">
          Amount to Add
        </label>
        <span className="dollarSign"></span>
        <input
          type="number"
          id="amount"
          placeholder="0"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value ? Number(e.target.value) : "")
          }
        />
      </div>
      <Buttons
        disabled={!amount || Number(amount) <= 0}
        onClick={handleConfirmAddition}
      >
        Confirm Addition
      </Buttons>
      <p>{error}</p>
    </>
  );
};

export default AddMoney;
