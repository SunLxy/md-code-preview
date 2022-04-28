import React from "react";
import expand from "./../assets/expand.svg";
import unexpand from "../assets/unexpand.svg";
import copy from "./../assets/copy.svg";
import checkSign from "./../assets/checkSign.svg";
import copyTextToClipboard from "@uiw/copy-to-clipboard";
import { CodeProps } from "./../interface";

const Code = (props: CodeProps) => {
  const { code, comments = {}, copyNodes } = props;
  const [show, setShow] = React.useState(false);
  const copyRef = React.useRef<HTMLDivElement>();
  const descRef = React.useRef<HTMLDivElement>();
  const isCopy = React.useMemo(() => {
    return !!copyNodes;
  }, [copyNodes]);

  const title = React.useMemo(() => {
    let domArr = [];
    let isTopBorder = true;
    console.log(comments);
    if (comments && Object.keys(comments).length) {
      if (comments.title) {
        domArr.push(
          <legend className="preview-title-head" key="1">
            {comments.title}
          </legend>
        );
        isTopBorder = true;
      }
      console.log(comments.description);
      if (comments.description && typeof comments.description !== "string") {
        domArr.push(
          <div className="preview-title-body" key="2">
            {comments.description}
          </div>
        );
        isTopBorder = false;
      } else if (comments.description) {
        domArr.push(
          <div className="preview-title-body" ref={descRef} key="2"></div>
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
  }, [comments]);

  const onCopy = () => {
    const classList = copyRef.current.getAttribute("class");
    copyRef.current.setAttribute(
      "class",
      `${classList} preview-button-copy-active`
    );
    // let arrChild: Node[] = [];
    // if (Array.isArray(node)) {
    //   arrChild = node;
    // } else if (node) {
    //   if (node.children && Array.isArray(node.children)) {
    //     arrChild = node.children;
    //   }
    // }
    copyTextToClipboard(copyNodes, function () {
      setTimeout(() => {
        copyRef.current.setAttribute("class", `${classList}`);
      }, 2000);
    });
  };

  const CopyRender = React.useMemo(() => {
    if (isCopy) {
      return (
        <div
          ref={copyRef}
          onClick={onCopy}
          className="preview-button-span preview-button-copy"
        >
          <img className="copy" width={20} height={20} src={copy} />
          <img className="check" width={20} height={20} src={checkSign} />
        </div>
      );
    }
    return <React.Fragment />;
  }, [isCopy, copyNodes]);

  React.useEffect(() => {
    if (descRef.current) {
      if (comments.description && typeof comments.description === "string") {
        descRef.current.innerHTML = comments.description;
      }
    }
  }, [descRef.current, JSON.stringify(comments)]);

  return (
    <React.Fragment>
      {title}
      <div className="preview-button">
        {CopyRender}
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
