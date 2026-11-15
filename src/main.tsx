import React from "react";
import ReactDOM from "react-dom/client";
import { LanguageProvider } from "./i18n/LanguageProvider.tsx";
import App from "./ui/shell/App.tsx";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
);
