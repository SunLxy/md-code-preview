import MarkdownPreview from "@uiw/react-markdown-preview";
import React from "react";
import Code from "./Code";
export const getFileDirName = (resourcePath) => {
  return resourcePath.split(/\/|\\/).join("").replace(/.md$/, "");
};

const Preview = (props) => {
  const [mdStr, setMdStr] = React.useState({ source: "", assets: {} });
  const [mdAssets, setmdAssets] = React.useState({});
  const fileDirName = React.useMemo(() => {
    return getFileDirName(props.fileDirName);
  }, [props.fileDirName]);

  React.useEffect(() => {
    const getMds = async () => {
      const result = await props.getMdStr();
      if (result && result.default) {
        setMdStr({
          source: result.default.source,
          assets: result.default.filesValue,
        });
      }
    };
    getMds();
  }, [props.getMdStr]);

  // 使用plugin机制获取资源，再进行加载相应的案例组件
  React.useEffect(() => {
    const getAssset = async () => {
      const assets = require(`@@/${fileDirName}/assets.json`);
      setmdAssets(assets);
    };
    getAssset();
  }, [fileDirName]);

  return (
    <MarkdownPreview
      style={{ padding: "15px 15px" }}
      source={mdStr.source}
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
          if (mdStr.assets[line]) {
            const item = mdStr.assets[line];
            // plugin 机制 获取值
            const pluginItem = mdAssets[line];
            return (
              <React.Fragment>
                <div>下面是测试loader机制</div>
                <Code code={<code {...props} />} item={item} />
                <div>下面是测试plugin机制</div>
                <Code
                  code={<code {...props} />}
                  item={pluginItem}
                  getComponent={() => import(`@@/${pluginItem.path}`)}
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
  );
};

export default Preview;
