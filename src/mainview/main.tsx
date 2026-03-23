import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { getAccentColor, initRPC } from "./rpc";

// Prevent Backspace/Delete from navigating back in the SPA
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Backspace" &&
    !(
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    )
  ) {
    e.preventDefault();
  }
});

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

// Initialize Electrobun RPC bridge, then render
initRPC().then(async () => {
  const accent = await getAccentColor();
  if (accent) {
    document.documentElement.style.setProperty("--system-accent", accent);
  }

  createRoot(root).render(
    <StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </StrictMode>,
  );
});
