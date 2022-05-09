import React from "react";
import { CodeProps } from "../interface";
import Copy from "./Copy";
import ShowHide from "./ShowHide";
const Code = (props: CodeProps) => {
  const { code, copyNodes, language, customButton, codePadding } = props;
  const [show, setShow] = React.useState(false);
  const style = React.useMemo(() => {
    if (typeof codePadding) {
      return { padding: codePadding };
    }
    return {};
  }, [codePadding]);

  return (
    <React.Fragment>
      <div className="preview-button">
        {customButton}
        <Copy copyNodes={copyNodes} />
        <ShowHide show={show} onClick={setShow} />
      </div>
      <div className={`preview-code preview-code-${show}`} style={style}>
        <pre className={`language-${language}`}>{code}</pre>
      </div>
    </React.Fragment>
  );
};

export default Code;
