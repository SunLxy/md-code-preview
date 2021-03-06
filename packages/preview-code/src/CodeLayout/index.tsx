import Code from "./code";
import { PreviewProps } from "./interface";
import "./styles/index.css";
export * from "./interface";
import React from "react";

const CodeLayout = (props: PreviewProps) => {
  const {
    prefixCls = "w-code-layout",
    code,
    className = "",
    copyNodes = "",
    previewBodyClassName = "",
    language = "jsx",
    customButton,
    bordered = true,
    noCode = false,
    codePadding = 16,
    ...rest
  } = props;
  return (
    <div className={`${prefixCls} ${prefixCls}-body-${bordered} ${className}`}>
      <div
        {...rest}
        className={`preview preview-body-${bordered} ${previewBodyClassName}`}
      />
      {!noCode && (
        <Code
          codePadding={codePadding}
          customButton={customButton}
          language={language}
          code={code}
          copyNodes={copyNodes}
        />
      )}
    </div>
  );
};
export default CodeLayout;
