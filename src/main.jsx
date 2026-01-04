import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { MidiProvider } from "./context/MidiContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MidiProvider>
      <App />
    </MidiProvider>
  </StrictMode>
);
