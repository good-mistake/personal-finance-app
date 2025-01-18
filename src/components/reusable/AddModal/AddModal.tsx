import React, { useEffect, useState, useMemo, useCallback } from "react";
import chroma from "chroma-js";
import CustomSelect from "../customSelect/CustomSelect";
import Buttons from "../button/Buttons";
import { generateColorList } from "../../../utils/utils";
import { v4 as uuidv4 } from "uuid";
interface AddModalProps {
  type: "pot" | "budget" | "transaction";
  title: string;
  description: string;
  onSave: (newItem: any) => void;
  onClose: () => void;
  existingItems: any[];
  generateId?: () => string;
  maxNameLength?: number;
  categoryOptions?: string[];
  error?: string | null;
}

const AddModal: React.FC<AddModalProps> = ({
  type,
  title,
  description,
  onSave,
  onClose,
  existingItems,
  generateId = () => uuidv4(),
  maxNameLength = 30,
  categoryOptions = [],
  error = "",
}) => {
  const [itemName, setItemName] = useState("");
  const [target, setTarget] = useState(0);
  const [maximum, setMaximum] = useState(0);
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState<Date | null>(null);
  const [theme, setTheme] = useState<string>("");
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [colorNamesMap, setColorNamesMap] = useState<Record<string, string>>(
    {}
  );
  const [recurring, setRecurring] = useState<boolean>(false);
  const [amountType, setAmountType] = useState("+");
  const [dateError, setDateError] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [openSelect, setOpenSelect] = useState<string | null>(null);
  const [errors, setErrors] = useState<string>("");
  const existingColors = useMemo(
    () => existingItems.map((item) => item.theme),
    [existingItems]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".customSelect")) {
        setOpenSelect(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const colorsToMap = generateColorList(existingColors, 30);
    setColorOptions(colorsToMap);

    const worker = new Worker(
      new URL("../../../colorWorker.worker.js", import.meta.url)
    );

    worker.onmessage = (event) => {
      setColorNamesMap(event.data);
    };

    worker.postMessage(colorsToMap);

    return () => worker.terminate();
  }, [existingColors]);

  const handleSave = useCallback(() => {
    if (type === "pot" && itemName && target > 0 && chroma.valid(theme)) {
      const newPot = {
        id: generateId(),
        name: itemName,
        target,
        total: 0,
        theme,
      };
      onSave(newPot);
    } else if (
      type === "budget" &&
      category &&
      maximum > 0 &&
      chroma.valid(theme)
    ) {
      const newBudget = {
        id: generateId(),
        category,
        maximum,
        total: 0,
        theme,
      };
      onSave(newBudget);
    } else if (
      type === "transaction" &&
      itemName &&
      typeof amount === "number" &&
      amount > 0 &&
      chroma.valid(theme) &&
      category
    ) {
      const signedAmount = amountType === "+" ? amount : -amount;
      const newTransaction = {
        id: generateId(),
        name: itemName,
        amount: signedAmount,
        date: date?.toISOString(),
        category: category,
        theme: theme,
        recurring,
      };
      onSave(newTransaction);
    } else {
      console.error(
        "Invalid input: Ensure all fields are filled and color is valid."
      );
      setErrors(
        "Invalid input: Ensure all fields are filled and color is valid."
      );
      return;
    }
    onClose();
  }, [
    type,
    itemName,
    target,
    maximum,
    amount,
    theme,
    category,
    date,
    onSave,
    onClose,
    generateId,
    amountType,
    recurring,
  ]);
  const handleSelectOpen = (selectName: string) => {
    setOpenSelect((prev) => (prev === selectName ? null : selectName));
  };

  return (
    <>
      <div className="modalHeader">
        <h2>{title}</h2>
        <img src="/images/icon-close-modal.svg" alt="" onClick={onClose} />
      </div>
      <p>{description}</p>
      {type === "pot" && (
        <>
          <div className="addItemName">
            <label htmlFor="itemName">Name</label>
            <input
              id="itemName"
              type="text"
              placeholder="Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <div>{maxNameLength - itemName.length} characters left</div>
          </div>
          <div className="addTarget">
            <label htmlFor="target">Target</label>
            <input
              type="number"
              placeholder="0"
              onChange={(e) => setTarget(Number(e.target.value))}
            />
            <span></span>
          </div>
        </>
      )}
      {type === "budget" && (
        <>
          <div
            className="colorOptions"
            onClick={() => handleSelectOpen("category")}
          >
            <CustomSelect
              colorOptions={categoryOptions}
              existingColors={[]}
              theme={category}
              setTheme={setCategory}
              colorNamesMap={{}}
              category={true}
              open={openSelect === "category"}
            />
          </div>
          <div className="addTarget">
            <label htmlFor="target">Maximum Spend</label>
            <input
              type="number"
              placeholder="0"
              onChange={(e) => setMaximum(Number(e.target.value))}
            />
            <span></span>
          </div>
        </>
      )}
      {type === "transaction" && (
        <>
          <div className="addItemName">
            <label htmlFor="itemName">Name</label>
            <input
              id="itemName"
              type="text"
              placeholder="Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <div>{maxNameLength - itemName.length} characters left</div>
          </div>
          <div className="addAmount">
            <label>Amount</label>
            <div className="amountInputWrapper">
              <button
                type="button"
                className={`transactionButton receiveBtn ${
                  amountType === "+" ? "active receive" : ""
                }`}
                onClick={() => setAmountType("+")}
              >
                Received
              </button>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount === "" ? "" : Math.abs(amount)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setAmount("");
                  } else {
                    const parsedValue = parseFloat(value);
                    if (!isNaN(parsedValue)) {
                      setAmount(parsedValue);
                    }
                  }
                }}
              />
              <button
                type="button"
                className={`transactionButton sentBtn ${
                  amountType === "-" ? "active send" : ""
                }`}
                onClick={() => setAmountType("-")}
              >
                Sent
              </button>
            </div>
          </div>
          <div
            className="dateAndCategory"
            onClick={() => handleSelectOpen("recurring")}
          >
            <div className="colorOptions">
              <label htmlFor="">Recurring Monthly</label>

              <CustomSelect
                theme={recurring ? "Yes" : "No"}
                setTheme={(value) => setRecurring(value === "Yes")}
                options={["Yes", "No"]}
                isRecurringSelect={true}
                open={false}
              />
            </div>
            <div className="addDate">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                max={
                  new Date(new Date().setDate(new Date().getDate() + 15))
                    .toISOString()
                    .split("T")[0]
                }
                min={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 10)
                  )
                    .toISOString()
                    .split("T")[0]
                }
                placeholder="Name"
                value={date ? date.toISOString().split("T")[0] : ""}
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  const today = new Date();

                  const tenDaysFromNow = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate() + 15
                  );

                  if (selectedDate > tenDaysFromNow) {
                    setDateError("Future dates up to 15 are not allowed.");
                  } else if (
                    selectedDate <
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 10)
                    )
                  ) {
                    setDateError("Dates older than 10 years are not allowed.");
                  } else if (isNaN(selectedDate.getTime())) {
                    setDateError("Invalid date. Please select a valid date.");
                  } else {
                    setDateError("");
                    setDate(selectedDate);
                  }
                }}
              />
              <p> {dateError}</p>
            </div>
          </div>
          <div
            className="colorOptions"
            onClick={() => handleSelectOpen("category")}
          >
            <CustomSelect
              colorOptions={categoryOptions}
              existingColors={[]}
              theme={category}
              setTheme={setCategory}
              colorNamesMap={{}}
              category={true}
              open={openSelect === "category"}
            />
          </div>
        </>
      )}
      <div className="colorOptions" onClick={() => handleSelectOpen("theme")}>
        <CustomSelect
          colorOptions={colorOptions}
          existingColors={existingColors}
          colorNamesMap={colorNamesMap}
          theme={theme}
          setTheme={setTheme}
          open={false}
        />
      </div>
      <Buttons
        onClick={handleSave}
        variant="primary"
        size="large"
        disabled={false}
      >
        Save
      </Buttons>
      <p>{errors || error}</p>
    </>
  );
};

export default AddModal;
