import React from "react";
import "./index.less";
import "./index.css";
import ReactClient from "react-dom/client";
import App from "./app/App";
// import Dmode from "./.docs/examplessrcappApp";
// import Dmode2 from "./.docs/examplesREADME";
// import Dmode2 from "./da4";
ReactClient.createRoot(document.getElementById("root")).render(
  <React.Fragment>
    <div style={{ padding: 20 }}>
      {/* <Dmode2 /> */}
      {/* <Dmode /> */}
      <App />
    </div>
  </React.Fragment>
);
