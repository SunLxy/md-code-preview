import MarkdownPreview from "@uiw/react-markdown-preview";
import React from "react";
import Preview from "md-code-preview";

export const getFileDirName = (resourcePath) => {
  return resourcePath.split(/\/|\\/).join("").replace(/.md$/, "");
};

const PreviewCode = (props) => {
  const [mdStr, setMdStr] = React.useState("");
  const [mdAssets, setmdAssets] = React.useState({});
  const fileDirName = React.useMemo(() => {
    return getFileDirName(props.fileDirName);
  }, [props.fileDirName]);

  React.useEffect(() => {
    const getMds = async () => {
      const result = await props.getMdStr();
      if (result && result.default) {
        setMdStr(result.default);
      }
    };
    getMds();
  }, [props.getMdStr]);

  // 使用plugin机制获取资源，再进行加载相应的案例组件
  React.useEffect(() => {
    const getAssset = async () => {
      const assets = require(`@@/code-${fileDirName}/assets.js`);
      if (assets && assets.default) {
        setmdAssets(assets.default);
      }
    };
    getAssset();
  }, [fileDirName]);

  const isShowNode = (ignoreRows = [], line) => {
    let isShow = false;
    let i = 0;
    let lg = ignoreRows.length;
    while (i < lg) {
      const { start, end } = ignoreRows[i];
      if (start <= line && line < end) {
        isShow = true;
        break;
      }
      i++;
    }
    return isShow;
  };

  const checkNode = ({ node, ...rest }) => {
    const line = node.position.start.line;
    const TagName = node.tagName;
    if (isShowNode(mdAssets.ignoreRows || [], line)) {
      return null;
    }
    return <TagName {...rest} />;
  };

  return (
    <React.Fragment>
      <MarkdownPreview
        style={{ padding: "15px 15px" }}
        source={mdStr}
        components={{
          p: checkNode,
          h2: checkNode,
          blockquote: checkNode,
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

            const line = node.position.start.line;
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
            if (mdAssets[line]) {
              // plugin 机制 获取值
              const pluginItem = mdAssets[line];
              const code = (
                <pre className={props.className}>
                  <code {...props} />
                </pre>
              );
              return (
                <React.Fragment>
                  <Preview
                    isSpacing={false}
                    copyNodes={pluginItem.value}
                    component={() => import(`@@/${pluginItem.path}`)}
                    code={code}
                    comments={pluginItem.comments}
                  />
                </React.Fragment>
              );
            }

            if (
              Object.keys(config).filter((name) => config[name] !== undefined)
                .length === 0
            ) {
              return <code {...props} />;
            }

            return <React.Fragment />;
          },
        }}
      />
    </React.Fragment>
  );
};

export default PreviewCode;
