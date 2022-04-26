import React from "react";
import App from "./app/App";
import "./index.less";
import "./index.css";
import ReactClient from "react-dom/client";
import baseDom5 from "./da3";
import ExamplesREADME from "./.docs/examplesREADME";
ReactClient.createRoot(document.getElementById("root")).render(
  <React.Fragment>
    <App />
    {baseDom5()}
    <ExamplesREADME />
  </React.Fragment>
);
