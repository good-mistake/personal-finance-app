import React from "react";
import ModalManager from "../../../reusable/modalManage/ModalManager.tsx";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../redux/transactionSlice.ts";
import AddTransaction from "../addTransaction/AddTransaction.tsx";
import EditTransaction from "../editTransaction/EditTransaction.tsx";
import DeleteTransaction from "../deleteTransaction/DeleteTransaction.tsx";
const TransactionModalManager = () => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };
  const modalMap = {
    addTransaction: <AddTransaction onClose={handleClose} />,
    editTransaction: <EditTransaction />,
    deleteTransaction: <DeleteTransaction />,
  };

  return (
    <ModalManager
      activeModalSelector={(state: RootState) => state.transaction.activeModal}
      closeModalAction={closeModal}
      modalMap={modalMap}
    />
  );
};
export default TransactionModalManager;
