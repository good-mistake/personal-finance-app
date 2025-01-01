import React from "react";
import ModalManager from "../../../reusable/modalManage/ModalManager.tsx";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";

import { closeModal } from "../../../redux/budgetSlice.ts";
import AddBudgetModal from "../addBudget/AddBudgetModal.tsx";
import EditBudget from "../editBudget/EditBudget.tsx";
import DeleteBudget from "../deleteBudget/DeleteBudget.tsx";
const BudgetModalManager = () => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };
  const modalMap = {
    addBudget: <AddBudgetModal onClose={handleClose} />,
    editBudget: <EditBudget />,
    deleteBudget: <DeleteBudget />,
  };
  return (
    <ModalManager
      activeModalSelector={(state: RootState) => state.budgets.activeModal}
      closeModalAction={closeModal}
      modalMap={modalMap}
    />
  );
};
export default BudgetModalManager;
