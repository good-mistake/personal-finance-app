import React, { useEffect, useState } from "react";
import CustomSelect from "../customSelect/CustomSelect.tsx";
import Buttons from "../button/Buttons.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store.ts";
interface EditModalProps<T = Record<string, any>> {
  initialData: T;
  colorOptions: string[];
  categoryOptions: string[];
  existingColors: string[];
  onSave: (updatedData: T) => void;
  onCancel: () => void;
  description?: React.ReactNode;
}

const EditModal = <T extends Record<string, any>>({
  initialData,
  colorOptions,
  categoryOptions,
  description = false,
  existingColors,
  onSave,
  onCancel,
}: EditModalProps<T>) => {
  const [data, setData] = useState<T>(initialData);
  const [colorNamesMap, setColorNamesMap] = useState<Record<string, string>>(
    {}
  );

  const [openSelect, setOpenSelect] = useState<string | null>(null);
  const selectedBudget = useSelector(
    (state: RootState) => state.budgets.selectedBudget
  );
  const selectedPot = useSelector((state: RootState) => state.pots.selectedPot);
  const selectedTransaction = useSelector(
    (state: RootState) => state.transaction.selectedTransaction
  );
  useEffect(() => {
    const worker = new Worker(
      new URL("../../../colorWorker.worker.js", import.meta.url)
    );

    worker.onmessage = (event) => {
      setColorNamesMap(event.data);
    };

    worker.postMessage(colorOptions);

    return () => {
      worker.terminate();
    };
  }, [colorOptions]);
  const maxNameLength = 30;

  const handleSave = () => {
    if (onSave) {
      onSave(data);
    }
  };

  const handleChange = (field: keyof T, value: any) => {
    setData((prev) => ({ ...prev, [field]: value as T[keyof T] }));
  };
  const handleSelectOpen = (selectName: string) => {
    setOpenSelect(openSelect === selectName ? null : selectName);
  };
  return (
    <>
      <div className="modalHeader">
        <h2>
          Edit '
          {selectedPot?.name ||
            selectedBudget?.category ||
            selectedTransaction?.name ||
            "Item"}
          '
        </h2>
        <img
          src="/images/icon-close-modal.svg"
          alt="Close"
          onClick={onCancel}
        />
      </div>
      <p>
        {description ||
          "If your saving targets change, feel free to update your pots."}
      </p>
      {"name" in data && (
        <div className="addItemName">
          <label htmlFor="potName">
            {`${selectedPot?.name ? "Pot" : "Transaction"}`} Name
          </label>
          <input
            id="itemName"
            type="text"
            value={data.name || ""}
            maxLength={maxNameLength}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <div className="charLeft">
            {maxNameLength - data.name.length} characters left
          </div>
        </div>
      )}
      {"category" in data && (
        <div
          className="colorOptions"
          onClick={() => handleSelectOpen("category")}
        >
          <CustomSelect
            colorOptions={categoryOptions}
            existingColors={[]}
            theme={data.category}
            setTheme={(value) => handleChange("category", value)}
            colorNamesMap={{}}
            category={true}
            open={openSelect === "category"}
          />
        </div>
      )}
      {"amount" in data && (
        <div className="addAmount">
          <label htmlFor="amount">Amount</label>
          <div className="amountInputWrapper">
            <button
              type="button"
              className={`transactionButton receiveBtn ${
                data.amount >= 0 ? "active receive" : ""
              }`}
              onClick={() => handleChange("amount", Math.abs(data.amount))}
            >
              Received
            </button>
            <input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={data.amount === "" ? "" : Math.abs(data.amount)}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  handleChange("amount", 0);
                } else {
                  const parsedValue = parseFloat(value);
                  if (!isNaN(parsedValue)) {
                    handleChange("amount", parsedValue);
                  }
                }
              }}
            />
            <button
              type="button"
              className={`transactionButton sentBtn ${
                data.amount < 0 ? "active send" : ""
              }`}
              onClick={() => handleChange("amount", -Math.abs(data.amount))}
            >
              Sent
            </button>
          </div>
        </div>
      )}

      {"date" in data && "recurring" in data ? (
        <div
          className="dateAndCategory"
          onClick={() => handleSelectOpen("recurring")}
        >
          <div
            className="colorOptions"
            onClick={() => handleSelectOpen("recurring")}
          >
            <label htmlFor="recurring">Recurring</label>
            <CustomSelect
              theme={data.recurring ? "Yes" : "No"}
              setTheme={(value) => handleChange("recurring", value === "Yes")}
              options={["Yes", "No"]}
              isRecurringSelect={true}
              open={openSelect === "recurring"}
            />
          </div>
          <div className="addDate">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={data.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>
        </div>
      ) : "date" in data ? (
        <div className="transactionDate">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={data.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
        </div>
      ) : (
        ""
      )}
      {"target" in data && (
        <div className="addPotTarget">
          <label htmlFor="target">Target</label>
          <input
            type="number"
            placeholder="0"
            id="target"
            onChange={(e) => handleChange("target", e.target.value)}
          />
          <span></span>
        </div>
      )}
      {"maximum" in data && (
        <div className="addPotTarget">
          <label htmlFor="maximum">Maximum</label>
          <input
            type="number"
            placeholder={
              selectedBudget?.maximum !== undefined
                ? `${selectedBudget.maximum}`
                : ""
            }
            id="maximum"
            onChange={(e) => handleChange("maximum", e.target.value)}
          />
          <span></span>
        </div>
      )}
      {"theme" in data && (
        <div className="colorOptions" onClick={() => handleSelectOpen("theme")}>
          <CustomSelect
            colorOptions={colorOptions}
            existingColors={existingColors}
            theme={data.theme}
            setTheme={(value) => handleChange("theme", value)}
            colorNamesMap={colorNamesMap}
            open={openSelect === "theme"}
          />
        </div>
      )}

      <Buttons
        onClick={handleSave}
        variant="primary"
        size="large"
        disabled={false}
      >
        Save Changes
      </Buttons>
    </>
  );
};

export default EditModal;
