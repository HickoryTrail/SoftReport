import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 运行时注入 HarmonyOS Sans SC 字体声明
// 放在 index.html 中会被 vite-plugin-singlefile 内联为 base64（字体文件 >8MB）
const fontStyle = document.createElement("style");
fontStyle.textContent = [
  '@font-face {',
  '  font-family: "HarmonyOS Sans SC";',
  '  src: url("./fonts/HarmonyOS_Sans_SC_Regular.ttf") format("truetype");',
  '  font-weight: 400;',
  '  font-style: normal;',
  '  font-display: swap;',
  '}',
  '@font-face {',
  '  font-family: "HarmonyOS Sans SC";',
  '  src: url("./fonts/HarmonyOS_Sans_SC_Medium.ttf") format("truetype");',
  '  font-weight: 500;',
  '  font-style: normal;',
  '  font-display: swap;',
  '}',
  '@font-face {',
  '  font-family: "HarmonyOS Sans SC";',
  '  src: url("./fonts/HarmonyOS_Sans_SC_Bold.ttf") format("truetype");',
  '  font-weight: 700;',
  '  font-style: normal;',
  '  font-display: swap;',
  '}',
].join("\n");
document.head.appendChild(fontStyle);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
