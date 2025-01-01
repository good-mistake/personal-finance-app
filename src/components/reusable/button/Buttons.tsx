import React from "react";
import "./buttons.scss";
interface ButtonProps {
  variant?: "primary" | "secondary" | "tertiary" | "destroy" | "word";
  size?: "small" | "medium" | "large";
  disabled: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: string;
}
const Buttons: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "small",
  disabled = false,
  onClick,
  children,
  className = "",
  type = "",
}) => {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
      {variant === "tertiary" && (
        <img src="/images/icon-caret-right.svg" alt="caret" />
      )}
    </button>
  );
};

export default Buttons;
