import React from "react";
import "./index.less";
import "./index.css";
import ReactClient from "react-dom/client";
import App from "./app/App";
import Demo from "./da4";
ReactClient.createRoot(document.getElementById("root")).render(
  <React.Fragment>
    {/* <App /> */}
    <Demo />
  </React.Fragment>
);
