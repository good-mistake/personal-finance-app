import React from "react";
import DropDown from "../../../reusable/dropdownpot/DropDown.tsx";
import { useDispatch } from "react-redux";
import { setSelectedPot, openModal } from "../../../redux/potsSlice.ts";

const DropDownPot: React.FC<{ potId: string }> = ({ potId }) => {
  const dispatch = useDispatch();

  const handleEdit = () => {
    dispatch(setSelectedPot(potId));
    dispatch(openModal("editPot"));
  };

  const handleDelete = () => {
    dispatch(setSelectedPot(potId));
    dispatch(openModal("deletePot"));
  };

  const options = [
    { label: "Edit Pot", action: handleEdit },
    { label: "Delete Pot", action: handleDelete },
  ];
  return <DropDown options={options} type="default" />;
};

export default DropDownPot;
