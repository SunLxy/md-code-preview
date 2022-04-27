import React from "react";
import "./index.less";
import "./index.css";
import ReactClient from "react-dom/client";
import App from "./app/App";
ReactClient.createRoot(document.getElementById("root")).render(
  <React.Fragment>
    <App />
  </React.Fragment>
);
