import React from "react";
import { CodeProps } from "./../interface";
import Head from "./Head";
import Copy from "./Copy";
import ShowHide from "./ShowHide";
const Code = (props: CodeProps) => {
  const { code, comments = {}, copyNodes } = props;
  const [show, setShow] = React.useState(false);

  return (
    <React.Fragment>
      <Head comments={comments} />
      <div className="preview-button">
        <Copy copyNodes={copyNodes} />
        <ShowHide show={show} onClick={setShow} />
      </div>
      <div className={`preview-code preview-code-${show}`}>{code}</div>
    </React.Fragment>
  );
};

export default Code;
