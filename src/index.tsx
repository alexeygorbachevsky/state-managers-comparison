import React from "react";
import ReactDOM from "react-dom/client";

import { worker } from "api/mock-server/todos";

import "./index.scss";
import { App } from "./app";

(async () => {
  // Start mock API server
  // Make sure you have configured ssl certificate. Otherwise, see README.md for installation.
  await worker.start({ onUnhandledRequest: "bypass" });

  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
  );
  root.render(<App />);
})();
