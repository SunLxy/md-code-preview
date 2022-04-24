import React from "react"
import "./styles/index.css"
import { Button } from "uiw"
import ReactDOM from 'react-dom/client';

const Code = (props) => {
  const { code, item } = props
  const [show, setShow] = React.useState(false)
  const domRef = React.useRef(`${parseInt(String(Math.random() * 1e9), 10).toString(36)}`)
  /** 通过缓存的方式 解决 react v18 中 的报错   ***/
  // @ts-ignore
  const cachesRef = React.useRef(new Map([]));
  const ReactDOMRender = () => {
    return {
      createRoot: (id) => {
        return {
          render: (render) => {
            const caches = cachesRef.current;
            let root = caches.get(id);
            // 存在则不需要重新创建直接进行render操作
            if (root) {
              root.render(render);
            } else {
              root = ReactDOM.createRoot(document.getElementById(id));
              root.render(render);
              // 缓存，解决控制台报  ReactDOMClient.createRoot 问题
              caches.set(id, root);
            }
            cachesRef.current = caches;
          },
        };
      },
    };
  };
  /**  ------------------------   ***/


  React.useEffect(() => {
    try {
      const deps = {
        Button,
        React: React,
        ReactDOM: ReactDOMRender(),
      };
      const args = [];
      const argv = [];
      for (const key in deps) {
        args.push(key);
        argv.push(deps[key]);
      }
      const inp = item.babel.replace('_mount_', `"${domRef.current}"`)
      args.push(inp || '');
      new Function(...args).apply(null, argv);
    } catch (err) {
      console.log(err)
    }
  }, [item.babel])


  return <fieldset className="fieldset" >
    <div className="preview-body" id={domRef.current} />
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