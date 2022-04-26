import React from "react";
import Render from "./render";
import Code from "./code";
import "./styles/index.css";
import { PreviewProps } from "./interface";
export * from "./interface";

const Preview = (props: PreviewProps) => {
  const { code, comments, className, node, ...rest } = props;

  return (
    <fieldset className={`fieldset ${className}`}>
      <Render {...rest} />
      <Code code={code} comments={comments} node={node} />
    </fieldset>
  );
};
export default Preview;
