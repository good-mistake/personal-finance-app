import React, { useState, useRef, useEffect } from "react";
import "./filterSelect.scss";
import useMediaQuery from "../../../utils/useMediaQuery";
interface FilterSelectProps {
  label: string;
  options: string[];
  onSelect: (value: string) => void;
  firstSelect: string;
  variant?: "default" | "alternate";
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  options,
  onSelect,
  firstSelect,
  variant = "default",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(firstSelect);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("mobile");
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="filterSelect">
      {!isMobile ? <label>{label}</label> : ""}
      <div
        className={`selectWrapper ${isOpen ? "open" : ""}`}
        onClick={handleToggle}
        ref={dropdownRef}
      >
        {!isMobile ? (
          <>
            <span className="selected">{selectedOption}</span>
            <img
              src="./images/icon-caret-down.svg"
              className={`arrow-icon ${isOpen ? "rotate" : ""}`}
              alt="Arrow icon"
            />
          </>
        ) : (
          <>
            {variant === "default" ? (
              <img src="./images/icon-filter-mobile.svg" alt="" />
            ) : (
              <img src="./images/icon-sort-mobile.svg" alt="" />
            )}
          </>
        )}

        {isOpen && (
          <div
            className={`dropdownOptions ${variant === "default" && "default"}`}
          >
            {options.map((option) => (
              <div
                key={option}
                className={`dropdownOption ${
                  option === selectedOption ? "selected" : ""
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSelect;
