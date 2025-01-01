import React, { useState } from "react";
import "./sidebar.scss";
import SidebarMenu from "./sidebarmenu/SidebarMenu";
interface SidebarProps {
  variant: "tablet" | "mobile" | "desktop";
  position?: "left" | "right";
  onClick?: () => void;
  children: React.ReactNode;
}
const Sidebar: React.FC<SidebarProps> = ({
  onClick,
  variant = "desktop",
  position = "left",
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className={`sidebar sidebar--${variant}  sidebar--${position} ${
        isSidebarOpen ? "open" : "closed"
      }`}
    >
      <div className={` menu menu--${position}`}>
        <SidebarMenu
          size={variant}
          onToggle={setIsSidebarOpen}
          position={position}
        />
      </div>
      <div className={`content content--${variant}`}>{children}</div>
    </div>
  );
};

export default Sidebar;
