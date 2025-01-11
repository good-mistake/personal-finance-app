import React from "react";
import AddModal from "../../../reusable/AddModal/AddModal.tsx";
import { useDispatch, useSelector } from "react-redux";
import { addPot } from "../../../redux/potsSlice";
import { RootState } from "../../../redux/store";

const AddPot: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useDispatch();
  const pots = useSelector((state: RootState) => state.pots.pots);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/pots`;

  const handleSave = async (newPot) => {
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newPot),
        });

        if (!response.ok) {
          throw new Error("Failed to save pot");
        }

        const savedPot = await response.json();
        dispatch(addPot(savedPot));
      } catch (error) {
        console.error("Error adding pot:", error);
      }
    } else {
      dispatch(addPot(newPot));
    }
  };
  return (
    <AddModal
      title="Add New Pot"
      description="Create a pot to set savings targets. These can help keep you on track as you save for special purchases."
      onSave={handleSave}
      onClose={onClose}
      existingItems={pots || []}
      type="pot"
    />
  );
};

export default AddPot;
