import React from "react";
import Render from "./render";
import Code from "./code";
import { PreviewProps } from "./interface";
export * from "./interface";
/**
 * markdown.less 直接使用`@uiw/react-markdown-preview`(https://github.com/uiwjs/react-markdown-preview/blob/master/src/styles/markdown.less)的样式文件
 */
import "./styles/markdown.less";
import "./styles/index.css";
export { default as CodeLayout } from "./CodeLayout";
const Preview = (props: PreviewProps) => {
  const {
    code,
    comments,
    className = "",
    isSpacing = true,
    copyNodes = "",
    properties,
    codePenOptions,
    codeSandboxOptions,
    stackBlitzOptions,
    ...rest
  } = props;
  return (
    <div
      className={`preview-fieldset ${
        (isSpacing && "preview-fieldset-warp") || ""
      } ${className}`}
    >
      <Render {...rest} />
      <Code
        codePenOptions={codePenOptions}
        codeSandboxOptions={codeSandboxOptions}
        stackBlitzOptions={stackBlitzOptions}
        code={code}
        comments={comments}
        copyNodes={copyNodes}
      />
    </div>
  );
};
export default Preview;
