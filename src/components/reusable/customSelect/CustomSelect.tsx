import React, { useState, useEffect } from "react";
interface CustomSelectProps {
  colorOptions?: any;
  existingColors?: any;
  colorNamesMap?: any;
  theme: any;
  setTheme: any;
  category?: boolean;
  open: any;
  options?: string[];
  isRecurringSelect?: boolean;
}
const CustomSelect: React.FC<CustomSelectProps> = ({
  colorOptions,
  existingColors,
  colorNamesMap,
  theme,
  setTheme,
  category = false,
  open,
  options = [],
  isRecurringSelect = false,
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const handleSelect = (value) => {
    setTheme(value);
    setIsOpen(false);
  };
  const handleOpen = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
    setIsOpen((prev) => !prev);
  };
  useEffect(() => {
    setIsOpen(open);
  }, [open]);
  return (
    <div className={`customSelect `}>
      <p className="selectLabel">
        {isRecurringSelect ? "" : category ? "Category" : "Theme"}
      </p>
      <div className="selectedColor" onClick={(e) => handleOpen(e)}>
        {theme ? (
          <div className="colorAndName">
            {isRecurringSelect ? (
              theme
            ) : category ? (
              theme
            ) : (
              <>
                <span
                  style={{
                    backgroundColor: theme,
                    width: "20px",
                    height: "20px",
                    display: "inline-block",
                    marginRight: "10px",
                    borderRadius: "50%",
                  }}
                />
                {colorNamesMap[theme] || "Unknown"}
              </>
            )}
          </div>
        ) : (
          "Select a " +
          (isRecurringSelect
            ? "Recurring Option"
            : category
            ? "Category"
            : "Color")
        )}
      </div>
      <div className={`options ${isOpen ? "open" : ""}`}>
        {isRecurringSelect
          ? options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className="option"
                style={{
                  cursor: "pointer",
                }}
              >
                {option}
              </div>
            ))
          : category
          ? colorOptions.map((categoryOption, index) => (
              <div
                key={index}
                onClick={() => handleSelect(categoryOption)}
                className="option"
                style={{
                  cursor: "pointer",
                }}
              >
                {categoryOption}
              </div>
            ))
          : colorOptions.map((color, index) => (
              <div
                key={index}
                onClick={() =>
                  !existingColors.includes(color) && handleSelect(color)
                }
                className={`option ${
                  existingColors.includes(color) ? "disabled" : ""
                }`}
                style={{
                  cursor: "pointer",
                  opacity: existingColors.includes(color) ? "0.6" : "",
                }}
              >
                <div className="colorAndName">
                  <span
                    style={{
                      backgroundColor: color,
                      width: "20px",
                      height: "20px",
                      display: "inline-block",
                      marginRight: "10px",
                      borderRadius: "50%",
                    }}
                  />
                  {colorNamesMap[color] ||
                    (colorOptions.includes(color) ? color : "unknown")}{" "}
                </div>
                <span>
                  {existingColors.includes(color) ? (
                    <div className="alreadyInUse">
                      <span> Already Used</span>
                    </div>
                  ) : (
                    `${colorNamesMap[color] || ""}`
                  )}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default CustomSelect;
