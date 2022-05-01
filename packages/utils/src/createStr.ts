import { FilesValueType } from ".";
import { DepsType, DepNamespacesType } from "./interface";

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
  ${isInterval ? `import importHeadRender from "./importHeadRender"` : ``}
  ${isInterval ? `import importDescRender from "./importDescRender"` : ``}
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

/**------------------ 用以直接创建生成 react文件形式的代码字符串 ---------------------**/
/** 创建渲染字符串 **/
export const createBaseCodeRenderStr = (codeArr: string[]) => {
  let codeStr = ``;
  codeArr.forEach((str) => {
    codeStr += `${str};\n`;
  });
  return codeStr;
};
/**
 * 创建依赖字符串
 * **/
export const createDepsStr = (
  deps: DepsType[],
  depNamespaces: DepNamespacesType[],
  depDirects: DepNamespacesType[]
) => {
  let defaultStr = ``;
  let asStr = ``;
  let otherStr = ``;
  let directStr = ``;
  // 为了记录是否已经创建过了
  const defaultMap = new Map<string, string>([]);
  const asMap = new Map<string, string>([]);
  const otherMap = new Map<string, string[]>([]);
  const directMap = new Map<string, string>([]);

  /**
   * 1. 先创建 default 的字符串
   * 2. 再创建 as 方式的字符串
   * 3. 再创建 other 的字符串
   * **/
  deps.forEach((rowItem) => {
    Object.entries(rowItem).forEach(([key, itemValue]) => {
      const { default: defaultValue, other } = itemValue;
      if (defaultValue && !defaultMap.has(key)) {
        defaultMap.set(key, defaultValue);
        defaultStr += `import ${defaultValue} from "${key}";\n`;
      }
      if (other && Array.isArray(other)) {
        const oldOtherArr = otherMap.get(key) || [];
        let childStr = ``;
        other.forEach((str) => {
          const findx = oldOtherArr.findIndex((it) => it === str);
          if (findx === -1) {
            childStr += `${str},`;
            oldOtherArr.push(str);
          }
        });
        if (childStr) {
          otherStr += `import { ${childStr} } from "${key}";\n`;
        }
        otherMap.set(key, oldOtherArr);
      }
    });
  });

  depDirects.forEach((rowItem) => {
    Object.entries(rowItem).forEach(([key, value]) => {
      if (!directMap.has(key)) {
        directStr += `import "${key}";\n`;
        directMap.set(key, value);
      }
    });
  });

  depNamespaces.forEach((rowItem) => {
    Object.entries(rowItem).forEach(([key, value]) => {
      if (!asMap.has(key)) {
        asStr += `import ${value} from "${key}";\n`;
        asMap.set(key, value);
      }
    });
  });

  // 判断是否存在 React 依赖
  if (!defaultMap.has("react")) {
    defaultStr += `import React from "react";\n`;
  }

  return `
  import MdCodePreview from "md-code-preview"
  import copyTextToClipboard from '@uiw/copy-to-clipboard';
  ${defaultStr}  
  ${asStr}  
  ${otherStr}
  ${directStr}
  `;
};

/**
 * 创建标题/简介/复制code/code渲染/渲染组件的名称 字符串
 * **/
export const createOtherStr = (FilesValue: FilesValueType) => {
  let headStr = ``;
  let descStr = ``;
  let codeStr = ``;
  let copyNodeStr = ``;
  let baseCodeStr = ``;
  Object.entries(FilesValue).forEach(([key, itemValue]) => {
    const { desc, head, code, copyNode } = itemValue;
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
    baseCodeStr += `${key}:BaseCodeRenderComponent${key},\n`;
  });

  return `
  const importCopyNodeRender={${copyNodeStr}};\n
  const importHeadRender={${headStr}};\n
  const importDescRender={${descStr}};\n
  const importCodeRender={${codeStr}};\n
  const importBaseCodeRender={${baseCodeStr}};\n
  `;
};

/**
 * 最终的结果返回 react 代码
 * ***/
export const splicingString = (props: {
  depsStr: string;
  indexStr: string;
  baseStr: string;
  otherStr: string;
}) => {
  const { depsStr, indexStr, baseStr, otherStr } = props;
  return `
${depsStr};\n
${baseStr};\n
${otherStr};\n
export default  ()=>{
  return <div className="wmde-markdown wmde-markdown-color">
    ${indexStr}
  </div>
}
`;
};
