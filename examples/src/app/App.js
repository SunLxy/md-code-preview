import React from "react";
import Preview2 from "./Preview/index2";
// import Preview from "./Preview";
import { Button } from "uiw";
import language from "@/language.json";
// import ReactDOM from "react-dom/client";
export default function App() {
  const [lang, setLang] = React.useState("");
  return (
    <React.Fragment>
      {Object.entries(language).map(([_, item]) => {
        return (
          <Button
            type={lang === item.value ? "primary" : "light"}
            key={_}
            onClick={() => setLang(`${item.value}`)}
          >
            {item.label}
          </Button>
        );
      })}
      <Preview2 lang={lang} />
      {/* <Preview
        // getMdStr={() => import("md-code-preview/README.md")}
        // fileDirName="packages/preview-code/README.md"
        getMdStr={() => import(`md-code-preview/README${lang}.md`)}
        fileDirName={`packages/preview-code/README${lang}.md`}
      /> */}
    </React.Fragment>
  );
}
