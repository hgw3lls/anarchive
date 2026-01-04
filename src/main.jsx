import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./theme.css";

const rootElement = document.getElementById("root");

// TODO: Add app-level providers when needed.
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
