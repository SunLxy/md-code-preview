import React from "react";
import { CodeProps } from "./../interface";
import Head from "./Head";
import Copy from "./Copy";
import ShowHide from "./ShowHide";
import Codesandbox from "./codesandbox";
import Stackblitz from "./stackblitz";
import Codepen from "./codepen";
const Code = (props: CodeProps) => {
  const {
    code,
    comments = {},
    copyNodes,
    codePenOptions,
    CodeSandboxOptions,
    StackBlitzOptions,
  } = props;
  const [show, setShow] = React.useState(false);
  return (
    <React.Fragment>
      <Head comments={comments} />
      <div className="preview-button">
        <Codesandbox {...CodeSandboxOptions} />
        <Codepen {...codePenOptions} />
        <Stackblitz {...StackBlitzOptions} />
        <Copy copyNodes={copyNodes} />
        <ShowHide show={show} onClick={setShow} />
      </div>
      <div className={`preview-code preview-code-${show}`}>{code}</div>
    </React.Fragment>
  );
};

export default Code;
