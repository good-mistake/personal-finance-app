/* eslint-disable no-restricted-globals */
import namer from "color-namer";

self.onmessage = (event) => {
  const colors = event.data;
  const colorNamesMap = {};

  colors.forEach((color) => {
    try {
      const nameData = namer(color).ntc;
      colorNamesMap[color] = nameData[0]?.name || "Unknown";
    } catch (error) {
      console.error("Error naming color:", error);
      colorNamesMap[color] = "Unknown";
    }
  });

  self.postMessage(colorNamesMap);
};
