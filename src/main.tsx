import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { VenomConfig } from "./context/VenomConfig.tsx";
import { initVenomConnect } from "../venom-connect/configure.ts";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <VenomConfig initVenomConnect={initVenomConnect}>
      <App />
    </VenomConfig>
  </React.StrictMode>
);
