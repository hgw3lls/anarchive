import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const rootElement = document.getElementById("root");

<<<<<<< ours
=======
// TODO: Add app-level providers when needed.
>>>>>>> theirs
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
