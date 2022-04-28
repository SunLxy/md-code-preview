import React from "react";
import "./index.less";
import "./index.css";
import ReactClient from "react-dom/client";
import App from "./app/App";
import Demo from "./da4";
import Dmode from "./.docs/packagespreview-codeREADME";
import Dmode2 from "./.docs/examplesREADME";
import "./markdown.less";
ReactClient.createRoot(document.getElementById("root")).render(
  <React.Fragment>
    <div style={{ padding: 20 }}>
      <Dmode2 />
      <Dmode />
    </div>
    {/* <App /> */}
    {/* <Demo /> */}
  </React.Fragment>
);
