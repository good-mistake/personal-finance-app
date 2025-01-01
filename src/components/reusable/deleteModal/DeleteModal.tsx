import React from "react";

import Buttons from "../button/Buttons.tsx";
interface DeleteModalProps {
  itemName: string;
  onDelete: () => void;
  onCancel: () => void;
  type: "budget" | "pot" | "transaction";
}
const DeleteModal: React.FC<DeleteModalProps> = ({
  itemName,
  onDelete,
  onCancel,
  type,
}) => {
  const getDescription = () => {
    switch (type) {
      case "budget":
        return "Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever.";
      case "transaction":
        return "Are you sure you want to delete this transaction? This action cannot be reversed, and it will be removed permanently.";
      case "pot":
      default:
        return "Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever.";
    }
  };
  return (
    <>
      <div className="modalHeader">
        <h2>Delete '{itemName}'?</h2>
        <img
          src="/images/icon-close-modal.svg"
          alt="Close"
          onClick={onCancel}
        />
      </div>
      <p>{getDescription()}</p>

      <Buttons onClick={onDelete} disabled={false} variant="destroy">
        Yes, Confirm Deletion
      </Buttons>
      <Buttons onClick={onCancel} disabled={false} variant="word">
        No, Go Back
      </Buttons>
    </>
  );
};

export default DeleteModal;
