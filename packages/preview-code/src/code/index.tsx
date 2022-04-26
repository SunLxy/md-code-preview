import React from "react";
import expand from "./../assets/expand.svg";
import unexpand from "../assets/unexpand.svg";
import copy from "./../assets/copy.svg";
import checkSign from "./../assets/checkSign.svg";
import copyTextToClipboard from "@uiw/copy-to-clipboard";

export type CommentsType = {
  title?: string;
  description?: string;
  [k: string]: string;
};

export type StartAndEndType = {
  column: number;
  offset: number;
  line: number;
};

export type PositionType = {
  start: StartAndEndType;
  end: StartAndEndType;
};

export type Node = {
  children: Node[];
  position: PositionType;
  tagName: string;
  type: string;
  value: string;
  properties: { className: string[]; [k: string]: unknown };
};

export interface CodeProps {
  /** 原始 代码块 渲染**/
  code?: React.ReactNode;
  /** 解析出的注释内容 **/
  comments?: CommentsType;
  /** 解析出来的 node 对象 **/
  node?: Node;
}

export const getCodeString = (data: Node[] = [], code: string = "") => {
  data.forEach((node) => {
    if (node.type === "text") {
      code += node.value;
    } else if (
      node.type === "element" &&
      node.children &&
      Array.isArray(node.children)
    ) {
      code += getCodeString(node.children);
    }
  });
  return code;
};

const Code = (props: CodeProps) => {
  const { code, comments = {}, node } = props;
  const [show, setShow] = React.useState(false);
  const copyRef = React.useRef<HTMLDivElement>();

  const title = React.useMemo(() => {
    let domArr = [];
    let isTopBorder = false;
    if (comments && Object.keys(comments).length) {
      if (comments.title) {
        domArr.push(<legend key="1">{comments.title}</legend>);
        isTopBorder = true;
      }
      if (comments.description) {
        domArr.push(
          <React.Fragment key="2">{comments.description}</React.Fragment>
        );
        isTopBorder = false;
      }
    }
    return (
      <fieldset
        className={`preview-title fieldset ${
          isTopBorder && "preview-title-top-border"
        }`}
      >
        {domArr}
      </fieldset>
    );
  }, [JSON.stringify(comments)]);

  const onCopy = () => {
    const classList = copyRef.current.getAttribute("class");
    copyRef.current.setAttribute(
      "class",
      `${classList} preview-button-copy-active`
    );
    copyTextToClipboard(getCodeString(node.children), function () {
      setTimeout(() => {
        copyRef.current.setAttribute("class", `${classList}`);
      }, 2000);
    });
  };

  return (
    <React.Fragment>
      {title}
      <div className="preview-button">
        <div
          ref={copyRef}
          onClick={onCopy}
          className="preview-button-span preview-button-copy"
        >
          <img className="copy" width={20} height={20} src={copy} />
          <img className="check" width={20} height={20} src={checkSign} />
        </div>
        <div
          className="preview-button-span preview-code-exand-unexpand-icon"
          onClick={() => setShow(!show)}
        >
          <img
            width={20}
            height={20}
            src={expand}
            className={`preview-code-exand-unexpand-icon-${!show}`}
          />
          <img
            width={20}
            height={20}
            src={unexpand}
            className={`preview-code-exand-unexpand-icon-${show}`}
          />
        </div>
      </div>
      <div className={`preview-code preview-code-${show}`}>{code}</div>
    </React.Fragment>
  );
};

export default Code;
