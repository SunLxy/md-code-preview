import React from "react"

export interface PreviewProps {
  code?: string
  className?: string,
  dependencies: Record<string, any>
}

const Preview = (props: PreviewProps) => {
  const { code, className, dependencies } = props
  const domRef = React.useRef(`${parseInt(String(Math.random() * 1e9), 10).toString(36)}`)
  const { ReactDOM, ...rest } = dependencies

  const ReactDOMClient = React.useMemo(() => {
    return window.ReactDOM ? window.ReactDOM : ReactDOM
  }, [])

  const isV18 = React.useMemo(() => {
    return Reflect.has(ReactDOMClient || {}, "createRoot")
  }, [])

  /** 通过缓存的方式 解决 react v18 中 的报错   ***/
  // @ts-ignore
  const cachesRef = React.useRef(new Map<string, ReactDOMClient.Root>([]));
  // @ts-ignore
  const ReactDOMRender = (_ReactDOM: typeof ReactDOMClient) => {
    return {
      createRoot: (id: string) => {
        return {
          render: (render: React.ReactChild | Iterable<React.ReactNode>) => {
            const caches = cachesRef.current;
            let root = caches.get(id);
            // 存在则不需要重新创建直接进行render操作
            if (root) {
              root.render(render);
            } else {
              // @ts-ignore
              root = _ReactDOM.createRoot(document.getElementById(id)!);
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

  const getRender = () => {
    const deps = { ...rest }
    deps.ReactDOM = isV18 ? ReactDOMRender(ReactDOMClient) : ReactDOMClient
    const args = [];
    const argv: any = [];
    for (const key in deps) {
      args.push(key);
      argv.push(deps[key]);
    }
    let input = code
    // 判断是否是 react-dom v18版本
    if (Reflect.has(ReactDOM || {}, "createRoot") && input) {
      input = input + `\n ReactDOM.createRoot("${domRef.current}").render(/*#__PURE__*/React.createElement(Preview, null))`
    } else if (input) {
      input = input + `\n ReactDOM.render(/*#__PURE__*/React.createElement(Preview, null),document.getElementById('${domRef.current}'))`
    }
    if (input) {
      args.push(input || '');
      new Function(...args).apply(null, argv);
    }
  }

  React.useEffect(() => getRender(), [code])

  return <div className={className} id={domRef.current} />
}
export default Preview