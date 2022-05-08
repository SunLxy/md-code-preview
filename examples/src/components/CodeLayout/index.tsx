import Code from "./code";
import { PreviewProps } from "./interface";
import "./styles/index.css";
export * from "./interface";
const CodeLayout = (props: PreviewProps) => {
  const {
    code,
    className = "",
    copyNodes = "",
    previewBodyClassName,
    language = "jsx",
    customButton,
    bordered = true,
    noCode = true,
    ...rest
  } = props;
  return (
    <div
      className={`preview-fieldset preview-fieldset-border-${bordered}  ${className}`}
    >
      <div {...rest} className={`preview-body ${previewBodyClassName}`} />
      {noCode && (
        <Code
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
