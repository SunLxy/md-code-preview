import React from "react";
import Preview2 from "./Preview/index2";
import { Button } from "uiw";
import language from "@/language.json";
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
    </React.Fragment>
  );
}
