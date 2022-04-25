import React from "react";
import "./styles/index.css";
import { Button } from "uiw";
import ReactDOM from "react-dom/client";
import Preview from "md-code-preview";
const Code = (props) => {
  const { code, item } = props;
  const { comments } = item;
  const [show, setShow] = React.useState(false);
  console.log(comments);

  return (
    <fieldset className="fieldset">
      <Preview
        className="preview-body"
        code={item.transform}
        dependencies={{ Button, React, ReactDOM }}
      />
      {/* <div  id={domRef.current} /> */}
      <fieldset className="preview-title fieldset">
        <legend>{comments.title}</legend>
        {comments.description}
      </fieldset>
      <div className="preview-button">
        <button onClick={() => setShow(!show)}>展开/关闭</button>
      </div>
      <div className={`preview-code preview-code-${show}`}>{code}</div>
    </fieldset>
  );
};

export default Code;
