import React from "react";
import { CodeProps } from "../interface";
import Copy from "./Copy";
import ShowHide from "./ShowHide";
const Code = (props: CodeProps) => {
  const { code, copyNodes, language, customButton } = props;
  const [show, setShow] = React.useState(false);
  return (
    <React.Fragment>
      <div className="preview-button">
        {customButton}
        <Copy copyNodes={copyNodes} />
        <ShowHide show={show} onClick={setShow} />
      </div>
      <div className={`preview-code preview-code-${show}`}>
        <pre className={`language-${language}`}>{code}</pre>
      </div>
    </React.Fragment>
  );
};

export default Code;
