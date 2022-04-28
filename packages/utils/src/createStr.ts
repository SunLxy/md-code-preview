import { FilesValueType } from ".";
export const createStr = (otherObj: FilesValueType, indexStrs: string) => {
  let codeStr = ``;
  let headStr = ``;
  let descStr = ``;
  let copyNodeStr = ``;
  let transformStr = ``;
  Object.entries(otherObj).forEach(([key, values]) => {
    const { code, copyNode, head, desc, transform } = values;
    if (code) {
      codeStr += `${key}:<pre>${code}</pre>,\n`;
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
  import importDescRender from "./importDescRender"
  import importHeadRender from "./importHeadRender"
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
    importHeadRender: `import React from "react";\nexport default {${headStr}}`,
    importDescRender: `import React from "react";\nexport default {${descStr}}`,
    importCopyNodeRender: `export default {${copyNodeStr}}`,
    importBaseCodeRender: `export default {${transformStr}}`,
    index: indexStr,
  };
};
