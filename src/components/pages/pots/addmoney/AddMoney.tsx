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

  const handleConfirmAddition = async () => {
    const token = isAuthenticated ? localStorage.getItem("token") : null;
    if (!selectedPot || !selectedPot.id) {
      alert("Pot is not selected or ID is missing.");
      return;
    }
    if (selectedPot && typeof amount === "number" && amount > 0) {
      try {
        const updatedPot = {
          id: selectedPot.id,
          amount: Number(amount),
        };
        if (isAuthenticated && token) {
          await addMoneyAction(token, updatedPot);
        }
        dispatch(updatePotTotal(updatedPot));
        onClose();
      } catch (error) {
        console.error("Failed to add money:", error);
      }
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
            : `${formatCurrency(selectedPot?.total || 0)}`}{" "}
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
      <Buttons disabled={false} onClick={handleConfirmAddition}>
        Confirm Addition
      </Buttons>
    </>
  );
};

export default AddMoney;
