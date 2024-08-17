import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";
import reportWebVitals from "./config/reportWebVitals";
import ReactGA from "react-ga4";

const analyticsId = process.env.REACT_APP_GOOGLE_ANALYTICS_MEASUREMENT_ID;

if (analyticsId) {
  ReactGA.initialize(analyticsId);
  ReactGA.send({ hitType: "pageview", page: "index", title: "Wormle" });
}

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
