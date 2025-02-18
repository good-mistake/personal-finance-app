import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store.ts";
import { deletePot, closeModal } from "../../../redux/potsSlice.ts";
import DeleteModal from "../../../reusable/deleteModal/DeleteModal.tsx";
import { deletePotAction } from "../../../services/pots.js";

const DeletePot: React.FC = () => {
  const dispatch = useDispatch();
  const selectedPot = useSelector((state: RootState) => state.pots.selectedPot);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const handleDelete = async () => {
    const potId = selectedPot?.id || selectedPot?._id;

    if (!potId) {
      console.error("No selected pot or pot ID");
      return;
    }

    const token = isAuthenticated ? localStorage.getItem("token") : null;

    try {
      dispatch(deletePot(potId as string));

      if (isAuthenticated && token) {
        await deletePotAction(potId, token);
      }
    } catch (error) {
      console.error("Error deleting pot:", error);
    }

    dispatch(closeModal());
  };

  return (
    <DeleteModal
      itemName={selectedPot?.name || "this pot"}
      onDelete={handleDelete}
      onCancel={() => dispatch(closeModal())}
      type="pot"
    />
  );
};

export default DeletePot;
