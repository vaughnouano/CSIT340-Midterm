import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { PreferencesProvider } from "./exam4/PreferencesContext.jsx";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <PreferencesProvider>
    <App />
  </PreferencesProvider>,
);
