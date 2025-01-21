import { BrowserAgent } from "@newrelic/browser-agent/loaders/browser-agent";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const options = {
  init: {
    distributed_tracing: { enabled: true },
    privacy: { cookies_enabled: true },
    ajax: { deny_list: ["bam.eu01.nr-data.net"] },
  },
  info: {
    beacon: "bam.eu01.nr-data.net",
    errorBeacon: "bam.eu01.nr-data.net",
    licenseKey: import.meta.env.VITE_APP_NEW_RELIC_LICENSE_KEY,
    applicationID: import.meta.env.VITE_APP_NEW_RELIC_APP_ID,
    sa: 1,
  },
  loader_config: {
    accountID: import.meta.env.VITE_APP_NEW_RELIC_ACCOUNT_ID,
    trustKey: import.meta.env.VITE_APP_NEW_RELIC_TRUST_KEY,
    agentID: import.meta.env.VITE_APP_NEW_RELIC_APP_ID,
    licenseKey: import.meta.env.VITE_APP_NEW_RELIC_LICENSE_KEY,
    applicationID: import.meta.env.VITE_APP_NEW_RELIC_APP_ID,
  },
};

// The agent loader code executes immediately on instantiation.
new BrowserAgent(options);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
