import MarkdownPreview from '@uiw/react-markdown-preview';
import React from 'react';

export const getFileDirName = (resourcePath, rootContext) => {
  return resourcePath.split(/\/|\\/).join("").replace(/.md$/, "")
}

const Preview = (props) => {
  const [mdStr, setMdStr] = React.useState({ str: "", assets: {} })
  const fileDirName = React.useMemo(() => getFileDirName(props.fileDirName), [props.fileDirName])

  React.useEffect(() => {
    const getMds = async () => {
      const result = await props.getMdStr()
      if (result && result.default) {
        const assets = require(`@@/${fileDirName}/assets.json`)
        setMdStr({ str: result.default, assets })
      }
    }
    getMds()
  }, [props.url])

  return <MarkdownPreview
    style={{ padding: '15px 15px' }}
    source={mdStr.str}
    components={{
      /**
       * bgWhite 设置代码预览背景白色，否则为格子背景。
       * noCode 不显示代码编辑器。
       * noPreview 不显示代码预览效果。
       * noScroll 预览区域不显示滚动条。
       * codePen 显示 Codepen 按钮，要特别注意 包导入的问题，实例中的 import 主要用于 Codepen 使用。
       */
      code: ({ inline, node, ...props }) => {
        const {
          noPreview,
          noScroll,
          bgWhite,
          noCode,
          codePen,
          codeSandboxOption,
        } = props;

        const line = node.position.start.line


        if (inline) {
          return <code {...props} />;
        }

        const config = {
          noPreview,
          noScroll,
          bgWhite,
          noCode,
          codePen,
          codeSandboxOption,
        };

        if (mdStr.assets[line]) {
          const filename = mdStr.assets[line].filename
          const Dom = React.lazy(() => import(`@@/${fileDirName}/${filename}`))
          return <React.Fragment>
            <React.Suspense fallback="loading..." >
              <Dom />
            </React.Suspense>
            <div style={{ border: "1px solid red" }} ></div>
            <code {...props} />
          </React.Fragment>
        }

        if (
          Object.keys(config).filter(
            (name) => config[name] !== undefined,
          ).length === 0
        ) {
          return <code {...props} />;
        }

        return <React.Fragment />
      },
    }}

  />
}


export default Preview