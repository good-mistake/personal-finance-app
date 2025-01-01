import React, { useState, useEffect, useRef } from "react";
interface DropDownOption {
  label: string;
  action: () => void;
}

interface DropDownProps {
  options: DropDownOption[];
  type: "transaction" | "default";
}

const DropDown: React.FC<DropDownProps> = ({ options, type }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <div className="dropDownContainer" ref={dropdownRef}>
      {type === "default" && (
        <button onClick={toggleDropdown}>
          <img src="/images/icon-ellipsis.svg" alt="ellipsis" />
        </button>
      )}

      {(isDropdownOpen || type === "transaction") && (
        <div className="dropdownMenu">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                option.action();
                setIsDropdownOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown;
