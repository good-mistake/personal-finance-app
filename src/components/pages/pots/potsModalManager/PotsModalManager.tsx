import React from "react";
import ModalManager from "../../../reusable/modalManage/ModalManager.tsx";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";

import { closeModal } from "../../../redux/potsSlice";
import AddPot from "../addpot/AddPot";
import AddMoney from "../addmoney/AddMoney";
import WithDraw from "../withdraw/WithDraw";
import EditPotModal from "../editPot/EditPotModal.tsx";
import DeletePot from "../deletePot/DeletePot.tsx";
const PotsModalManager = () => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };
  const modalMap = {
    addPot: <AddPot onClose={handleClose} />,
    addMoney: <AddMoney onClose={handleClose} />,
    withDraw: <WithDraw onClose={handleClose} />,
    editPot: <EditPotModal />,
    deletePot: <DeletePot />,
  };
  return (
    <ModalManager
      activeModalSelector={(state: RootState) => state.pots.activeModal}
      closeModalAction={closeModal}
      modalMap={modalMap}
    />
  );
};
export default PotsModalManager;
