import { OtherMapType, FilesValueType } from ".";

export const createStr = (value: {
  str: string;
  otherMap: OtherMapType;
  filesValue: FilesValueType;
}) => {
  const { otherMap, str, filesValue } = value;

  let codeStr = ``;
  let headStr = ``;
  let descStr = ``;
  let copyNodeStr = ``;

  Array.from(otherMap.entries()).forEach(([key, values]) => {
    const { code, copyNode, head, desc, properties } = values;
    if (code) {
      codeStr += `${key}:<pre ${properties}>${code}</pre>,\n`;
    }
    if (head) {
      headStr += `${key}:<React.Fragment>${head}</React.Fragment>,\n`;
    }
    if (desc) {
      descStr += `${key}:<React.Fragment>${desc}</React.Fragment>,\n`;
    }
    if (copyNode) {
      copyNodeStr += `${key}: \`${copyNode}\`,`;
    }
  });

  let baseCode = ``;
  Object.entries(filesValue).forEach(([key, values]) => {
    baseCode += `${key}:${values.transform},\n`;
  });

  const indexStr = `
  import React from "react";
  import importCopyNodeRender from "./importCopyNodeRender"
  import importDescRender from "./importDescRender"
  import importHeadRender from "./importHeadRender"
  import importCodeRender from "./importCodeRender"
  import importBaseCodeRender from "./importBaseCodeRender"
  import copyTextToClipboard from '@uiw/copy-to-clipboard';
  const Code = (props)=>{
    console.log(props)
    return <div>
      {props.children}
      {props.code}
    </div>
  } 
  export default ()=>{
    return <div className="wmde-markdown wmde-markdown-color">
    ${str}
    </div>
  }
  `;

  return {
    importCodeRender: `import React from "react";\nimport copyTextToClipboard from '@uiw/copy-to-clipboard';\nexport default {${codeStr}}`,
    importHeadRender: `import React from "react";\nexport default {${headStr}}`,
    importDescRender: `import React from "react";\nexport default {${descStr}}`,
    importCopyNodeRender: `export default {${copyNodeStr}}`,
    importBaseCodeRender: `export default {${baseCode}}`,
    index: indexStr,
  };
};
