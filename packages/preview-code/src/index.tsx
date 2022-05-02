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
const Preview = (props: PreviewProps) => {
  const {
    code,
    comments,
    className = "",
    isSpacing = true,
    copyNodes = "",
    properties,
    dependenciesArr,
    ...rest
  } = props;
  console.log(props);
  return (
    <fieldset
      className={`preview-fieldset ${
        (isSpacing && "preview-fieldset-warp") || ""
      } ${className}`}
    >
      <Render {...rest} />
      <Code code={code} comments={comments} copyNodes={copyNodes} />
    </fieldset>
  );
};
export default Preview;
