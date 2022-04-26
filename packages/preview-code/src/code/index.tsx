import React from "react";
import expand from "./../assets/expand.svg";
import unexpand from "../assets/unexpand.svg";

export type CommentsType = {
  title?: string;
  description?: string;
  [k: string]: string;
};

export interface CodeProps {
  /** 原始 代码块 渲染**/
  code?: React.ReactNode;
  /** 解析出的注释内容 **/
  comments?: CommentsType;
}

const Code = (props: CodeProps) => {
  const { code, comments = {} } = props;
  const [show, setShow] = React.useState(false);

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

  return (
    <React.Fragment>
      {title}
      <div className="preview-button">
        <div
          className="preview-code-exand-unexpand-icon"
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
