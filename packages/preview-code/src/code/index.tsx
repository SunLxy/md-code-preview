import React from "react";
import expand from "./../assets/expand.svg";
import unexpand from "../assets/unexpand.svg";
import copy from "./../assets/copy.svg";
import checkSign from "./../assets/checkSign.svg";
import copyTextToClipboard from "@uiw/copy-to-clipboard";
import { CodeProps, Node } from "./../interface";
import { getCodeString } from "./../utils";

const Code = (props: CodeProps) => {
  const { code, comments = {}, node } = props;
  const [show, setShow] = React.useState(false);
  const copyRef = React.useRef<HTMLDivElement>();
  const titleRef = React.useRef<HTMLLegendElement>();
  const descRef = React.useRef<HTMLDivElement>();
  const isCopy = React.useMemo(() => {
    if (Array.isArray(node)) {
      return !!node.length;
    } else if (node) {
      if (node.children && Array.isArray(node.children)) {
        return !!node.children.length;
      }
    }
    return false;
  }, [node]);

  const title = React.useMemo(() => {
    let domArr = [];
    let isTopBorder = false;
    if (comments && Object.keys(comments).length) {
      if (comments.title) {
        domArr.push(
          <legend className="preview-title-head" key="1">
            {comments.title}
          </legend>
        );
        isTopBorder = true;
      }
      if (comments.description) {
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
  }, [JSON.stringify(comments)]);

  const onCopy = () => {
    const classList = copyRef.current.getAttribute("class");
    copyRef.current.setAttribute(
      "class",
      `${classList} preview-button-copy-active`
    );
    let arrChild: Node[] = [];
    if (Array.isArray(node)) {
      arrChild = node;
    } else if (node) {
      if (node.children && Array.isArray(node.children)) {
        arrChild = node.children;
      }
    }
    copyTextToClipboard(getCodeString(arrChild), function () {
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
  }, [isCopy, node]);

  React.useEffect(() => {
    if (descRef.current) {
      descRef.current.innerHTML = comments.description;
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
