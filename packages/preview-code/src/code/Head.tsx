import React from "react";
import { CodeProps } from "../interface";

const Head = (props: CodeProps) => {
  const { comments = {} } = props;
  const title = React.useMemo(() => {
    let domArr = [];
    let isTopBorder = true;
    if (comments && Object.keys(comments).length) {
      /** 判断标题 **/
      if (comments.title) {
        domArr.push(
          <legend className="preview-title-head" key="1">
            {comments.title}
          </legend>
        );
      }
      /** 判断简介说明 **/
      if (comments.description) {
        isTopBorder = false;
        domArr.push(
          <div className="preview-title-body" key="3">
            {comments.description}
          </div>
        );
      }
    }
    return (
      <fieldset
        className={`preview-title preview-fieldset ${
          isTopBorder && "preview-title-top-border"
        }`}
      >
        {domArr}
      </fieldset>
    );
  }, [comments]);

  return <React.Fragment>{title}</React.Fragment>;
};

export default Head;
