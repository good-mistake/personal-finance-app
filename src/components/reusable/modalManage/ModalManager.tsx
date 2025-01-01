import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { resetSelectedBudget } from "../../redux/budgetSlice";
import { resetSelectedPot } from "../../redux/potsSlice";
import { resetSelectedTransaction } from "../../redux/transactionSlice";
interface ModalManagerProps {
  activeModalSelector: (state: RootState) => string | null;
  closeModalAction: () => { type: string };
  modalMap: Record<string, React.ReactNode>;
}
const ModalManager: React.FC<ModalManagerProps> = ({
  activeModalSelector,
  closeModalAction,
  modalMap,
}) => {
  const dispatch = useDispatch();
  const activeModal = useSelector(activeModalSelector);
  const [isClosing, setIsClosing] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  useEffect(() => {
    if (activeModal) {
      setIsClosing(false);
      setIsFirstLoad(true);
    } else if (isFirstLoad) {
      setIsClosing(true);
    }
  }, [activeModal, isFirstLoad]);

  const handleClose = () => {
    switch (activeModal) {
      case "editPot":
        dispatch(resetSelectedPot());
        break;
      case "editTransaction":
        dispatch(resetSelectedTransaction());
        break;
      case "editBudget":
        dispatch(resetSelectedBudget());
        break;
      default:
        break;
    }

    setIsClosing(true);
    setTimeout(() => {
      dispatch(closeModalAction());
    }, 300);
  };

  const renderModalContent = () => {
    return activeModal ? modalMap[activeModal] : null;
  };

  return (
    <div
      className={`modalOverlay ${
        isClosing ? "closing" : isFirstLoad ? "open" : ""
      }`}
      onClick={handleClose}
      style={{ display: activeModal || isFirstLoad ? "flex" : "none" }}
    >
      <div
        className={`modal ${isClosing ? "closing" : isFirstLoad ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {renderModalContent()}
      </div>
    </div>
  );
};

export default ModalManager;
