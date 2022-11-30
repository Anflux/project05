import "./ThemeSelector.css";

import { useTheme } from "../hooks/useTheme";

import React from "react";

const themeColors = ["blue", "red", "yellow"];

const ThemeSelector = () => {
  const { changeColor } = useTheme();

  return (
    <div className="theme-selector">
      <div className="theme-buttons">
        {themeColors.map(color => (
          <div
            key={color}
            onClick={() => changeColor(color)}
            style={{ background: color }}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
