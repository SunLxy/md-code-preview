import React from "react";
import Preview from "./Preview";
import { Button } from "uiw";
import ReactDOM from "react-dom/client";
import Demo from "./Preview/Demo.tsx";

export default function App() {
  const [lang, setLang] = React.useState("");
  console.log(lang);
  return (
    <React.Fragment>
      <Button
        onClick={() => {
          setLang(!lang ? ".as" : "");
        }}
      >
        切换语言
      </Button>
      <Preview
        // getMdStr={() => import("md-code-preview/README.md")}
        // fileDirName="packages/preview-code/README.md"
        getMdStr={() => import(`./App${lang}.md`)}
        fileDirName={`examples/src/app/App${lang}.md`}
        dependencies={{ Button, React, ReactDOM, Demo }}
      />
    </React.Fragment>
  );
}
