import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { LoadingExperience } from "./components/LoadingExperience.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoadingExperience />
  </React.StrictMode>,
);
