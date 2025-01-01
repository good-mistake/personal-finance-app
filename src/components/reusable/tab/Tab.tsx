import React, { useState } from "react";
import "./tab.scss";
interface TabProps {
  variant: "primary" | "secondary" | "tertiary";
  children: React.ReactNode;
  onClick?: () => void;
}
const Tab: React.FC<TabProps> = ({ onClick, children }) => {
  return (
    <div className={`tab `} onClick={onClick}>
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAUElEQVR4nO3UMQoAIQxE0X88Jfe/gHoPF8HKaotFZfkPUqXIkGJAulAADahAPhGgAn1OWXb9g7k/QJ4hxvH0+m/Sn4RFhEUkHRYWERaRxD4PVRCKQIwHxmAAAAAASUVORK5CYII="
        alt="menu"
      />
      {children}
    </div>
  );
};

export default Tab;
