import React from "react";
import DropDown from "../../../reusable/dropdownpot/DropDown";
import {
  setSelectedTransaction,
  openModal,
} from "../../../redux/transactionSlice";
import { useDispatch } from "react-redux";

const DropDownTransaction: React.FC<{ transactionId: string }> = ({
  transactionId,
}) => {
  const dispatch = useDispatch();

  const handleEdit = () => {
    dispatch(setSelectedTransaction(transactionId));
    dispatch(openModal("editTransaction"));
  };

  const handleDelete = () => {
    dispatch(setSelectedTransaction(transactionId));
    dispatch(openModal("deleteTransaction"));
  };

  const options = [
    { label: "Edit Transaction", action: handleEdit },
    { label: "Delete Transaction", action: handleDelete },
  ];

  return <DropDown options={options} type="transaction" />;
};

export default DropDownTransaction;
