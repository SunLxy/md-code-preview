import React from "react"
import "./styles/index.css"
const Code = (props) => {
  const { children, code } = props
  const [show, setShow] = React.useState(false)

  return <fieldset className="fieldset" >
    <div className="preview-body" >
      {children}
    </div>
    <fieldset className="preview-title fieldset">
      <legend>标题</legend>
      按钮有类型：主按钮、次按钮、虚线按钮、文本按钮和链接按钮
    </fieldset>
    <div className="preview-button">
      <button onClick={() => setShow(!show)} >展开/关闭</button>
    </div>
    <div className={`preview-code preview-code-${show}`} >
      {code}
    </div>
  </fieldset>
}

export default Code