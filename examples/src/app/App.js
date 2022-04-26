import React from "react";
import Preview from "./Preview";
import { Button } from "uiw";
import ReactDOM from "react-dom/client";
import Demo from "./Preview/Demo.tsx";

export default function App() {
  return (
    <Preview
      // getMdStr={() => import("md-code-preview/README.md")}
      // fileDirName="packages/preview-code/README.md"
      getMdStr={() => import("./App.md")}
      fileDirName="examples/src/app/App.md"
      dependencies={{ Button, React, ReactDOM, Demo }}
    />
  );
}
