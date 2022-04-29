import { FilesValueType } from ".";
/**
 * 创建最后输出的字符串
 * **/
export const createStr = (
  otherObj: FilesValueType,
  indexStrs: string,
  // 是否需要查找代码块以上到标题之间的内容并合并到渲染组件内
  isInterval: boolean = true
) => {
  let codeStr = ``;
  let headStr = ``;
  let descStr = ``;
  let copyNodeStr = ``;
  let transformStr = ``;
  Object.entries(otherObj).forEach(([key, values]) => {
    const { code, copyNode, head, desc, transform } = values;
    if (code) {
      codeStr += `${key}:<React.Fragment>${code}</React.Fragment>,\n`;
    }
    if (head) {
      headStr += `${key}:<React.Fragment>${head}</React.Fragment>,\n`;
    }
    if (desc) {
      descStr += `${key}:<React.Fragment>${desc}</React.Fragment>,\n`;
    }
    if (copyNode) {
      copyNodeStr += `${key}: \`${copyNode}\`,\n`;
    }
    if (transform) {
      transformStr += `${key}: ${transform},\n`;
    }
  });

  const indexStr = `
  import React from "react";
  import importCopyNodeRender from "./importCopyNodeRender"
  ${isInterval ? `import importHeadRender from "./importHeadRender""` : ""}
  ${isInterval ? `import importDescRender from "./importDescRender"` : ""}
  import importCodeRender from "./importCodeRender"
  import importBaseCodeRender from "./importBaseCodeRender"
  import copyTextToClipboard from '@uiw/copy-to-clipboard';
  import MdCodePreview from "md-code-preview"
  export default ()=>{
    return <div className="wmde-markdown wmde-markdown-color">
    ${indexStrs}
    </div>
  }
  `;

  return {
    importCodeRender: `import React from "react";\nimport copyTextToClipboard from '@uiw/copy-to-clipboard';\nexport default {${codeStr}}`,
    importHeadRender: isInterval
      ? `import React from "react";\nexport default {${headStr}}`
      : "",
    importDescRender: isInterval
      ? `import React from "react";\nexport default {${descStr}}`
      : "",
    importCopyNodeRender: `export default {${copyNodeStr}}`,
    importBaseCodeRender: `export default {${transformStr}}`,
    index: indexStr,
  };
};
