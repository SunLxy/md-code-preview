import React from "react";
import Render, { RenderProps } from "./render";
import Code, { CodeProps } from "./code";
import "./styles/index.css";

export interface PreviewProps extends RenderProps, CodeProps {
  className?: string;
}

const Preview = (props: PreviewProps) => {
  const { code, comments, className, ...rest } = props;

  return (
    <fieldset className={`fieldset ${className}`}>
      <Render {...rest} />
      <Code code={code} comments={comments} />
    </fieldset>
  );
};
export default Preview;
