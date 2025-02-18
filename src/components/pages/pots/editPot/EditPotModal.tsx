import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store.ts";
import { editPot, closeModal } from "../../../redux/potsSlice.ts";
import EditModal from "../../../reusable/editModal/EditModal.tsx";
import { generateColorList } from "../../../../utils/utils.ts";
import { editPotAction } from "../../../services/pots.js";

const EditPotModal: React.FC = () => {
  const dispatch = useDispatch();
  const selectedPot = useSelector((state: RootState) => state.pots.selectedPot);
  const pots = useSelector((state: RootState) => state.pots.pots);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const existingColors = pots.map((pot) => pot.theme);
  const colorOptions = generateColorList(existingColors, 30);

  const handleSave = async (updatedData: {
    name: string;
    target: number;
    theme: string;
  }) => {
    if (!selectedPot) {
      console.error("No selected pot");
      return;
    }

    const token = isAuthenticated ? localStorage.getItem("token") : null;
    const potId = selectedPot.id || selectedPot._id;

    if (!potId) {
      console.error("Pot ID is missing");
      return;
    }

    try {
      const updatedPot = {
        id: potId,
        ...updatedData,
      };
      dispatch(editPot(updatedPot));
      if (isAuthenticated && token) {
        await editPotAction(token, updatedPot);
      }
    } catch (error) {
      console.error("Error updating pot:", error);
    }
    dispatch(closeModal());
  };

  return selectedPot ? (
    <EditModal
      initialData={{
        name: selectedPot.name,
        target: selectedPot.target,
        theme: selectedPot.theme,
      }}
      colorOptions={colorOptions}
      existingColors={existingColors}
      onSave={handleSave}
      onCancel={() => dispatch(closeModal())}
      categoryOptions={[]}
    />
  ) : null;
};

export default EditPotModal;
