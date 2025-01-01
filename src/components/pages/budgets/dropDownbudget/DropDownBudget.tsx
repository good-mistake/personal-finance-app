import React from "react";
import DropDown from "../../../reusable/dropdownpot/DropDown";
import { setSelectedBudget, openModal } from "../../../redux/budgetSlice";
import { useDispatch } from "react-redux";

const DropDownBudget: React.FC<{ budgetId: string }> = ({ budgetId }) => {
  const dispatch = useDispatch();

  const handleEdit = () => {
    dispatch(setSelectedBudget(budgetId));
    dispatch(openModal("editBudget"));
  };

  const handleDelete = () => {
    dispatch(setSelectedBudget(budgetId));
    dispatch(openModal("deleteBudget"));
  };

  const options = [
    { label: "Edit Budget", action: handleEdit },
    { label: "Delete Budget", action: handleDelete },
  ];

  return <DropDown options={options} type="default" />;
};

export default DropDownBudget;
