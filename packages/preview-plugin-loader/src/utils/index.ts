import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import generate from "@babel/generator";
export * from "./plugin";
export * from "./loader";
export * from "./interface";
import {
  FilesValueType,
  OtherProps,
  getProcessor,
  transformMarkdown,
  stepOne,
  stepTwo,
} from "md-plugin-utils";

export type DepsType = Record<string, { default: string; other: string[] }>;
export type DepNamespacesType = Record<string, string>;

// 引入 babel 插件
// 对代码块进行解析，获取import依赖，删除import ，拼接成一个方法字符串
export const getCodeStr = (content: string, funName: string) => {
  const ast = parse(content, {
    // 在严格模式下解析并允许模块声明
    sourceType: "module",
    plugins: [
      "jsx",
      "typescript",
      "classProperties",
      "dynamicImport",
      "exportDefaultFrom",
      "exportNamespaceFrom",
      "functionBind",
      "nullishCoalescingOperator",
      "objectRestSpread",
      "optionalChaining",
      "decorators-legacy",
    ],
  });

  const deps: DepsType = {};
  const depNamespaces: DepNamespacesType = {};

  const getNameOrValue = (node: t.Identifier | t.StringLiteral) => {
    if (t.isIdentifier(node)) {
      return node.name;
    } else if (t.isStringLiteral(node)) {
      return node.value;
    }
    return node;
  };
  /**
   * 1. 获取 import 依赖项
   * 2. 删除 import
   * 3. 对 export default 进行替换 return 返回
   *
   * */
  traverse(ast, {
    /** 解析 import  **/
    ImportDeclaration: (path) => {
      const node = path.node;
      if (node.specifiers && Array.isArray(node.specifiers)) {
        const keys = node.source.value;
        deps[keys] = { default: undefined, other: [] };
        node.specifiers.forEach((item) => {
          if (t.isImportDefaultSpecifier(item)) {
            deps[keys].default = getNameOrValue(item.local);
          } else if (t.isImportNamespaceSpecifier(item)) {
            depNamespaces[keys] = getNameOrValue(item.local);
          } else if (t.isImportSpecifier(item)) {
            const imported = getNameOrValue(item.imported);
            const local = getNameOrValue(item.local);
            if (imported === local) {
              deps[keys].other.push(imported);
            } else {
              deps[keys].other.push(`${imported} as ${local}`);
            }
          }
        });
      }
      // 移除
      path.remove();
    },
  });
  const code = generate(ast, {}, content).code;
  const newCode = code.replace("export default", `const Component${funName} =`);

  const returnCode = `
  const ${funName} = ()=>{
    ${newCode}
    return <Component${funName} />
  }
  `;
  return {
    code: returnCode,
    deps,
    depNamespaces,
  };
};

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
  depNamespaces: DepNamespacesType[]
) => {
  let defaultStr = ``;
  let asStr = ``;
  let otherStr = ``;

  // 为了记录是否已经创建过了
  const defaultMap = new Map<string, string>([]);
  const asMap = new Map<string, string>([]);
  const otherMap = new Map<string, string[]>([]);
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
        defaultStr += `import ${defaultValue} from "${key}"\n`;
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
          otherStr += `import { ${childStr} } from "${key}"\n`;
        }
        otherMap.set(key, oldOtherArr);
      }
    });
  });

  depNamespaces.forEach((rowItem) => {
    Object.entries(rowItem).forEach(([key, value]) => {
      if (!asMap.has(key)) {
        asStr += `import ${value} from "${key}"\n`;
      }
    });
  });

  // 判断是否存在 React 依赖
  if (!defaultMap.has("react")) {
    defaultStr += `import React from "react"\n`;
  }

  return `
  import MdCodePreview from "md-code-preview"
  import copyTextToClipboard from '@uiw/copy-to-clipboard';
  ${defaultStr}  
  ${asStr}  
  ${otherStr}
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

export const lastReturnString = (props: {
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

/**
 * @description:  最终的返回内容
 * @param {string} scope markdown字符串
 * @param {string} lang 解析代码块的语言
 * @param {OtherProps} otherProps 其他参数
 */
export const lastReturn = (
  scope: string,
  lang: string[] = ["jsx", "tsx"],
  otherProps: OtherProps = {}
) => {
  const processor = getProcessor();
  const { child, file } = transformMarkdown(scope, processor);
  const One = stepOne(child.children, lang, processor, file, otherProps);
  const { filesValue, indexStr } = stepTwo(
    One,
    child.children as any,
    file,
    processor,
    otherProps
  );
  const codeArr: string[] = [];
  const depsArr: DepsType[] = [];
  const depNamespacesArr: DepNamespacesType[] = [];
  Object.entries(filesValue).forEach(([key, itemValue]) => {
    const { copyNode } = itemValue;
    const { code, depNamespaces, deps } = getCodeStr(
      copyNode,
      `BaseCodeRenderComponent${key}`
    );
    codeArr.push(code);
    depsArr.push(deps);
    depNamespacesArr.push(depNamespaces);
  });
  const depsStr = createDepsStr(depsArr, depNamespacesArr);
  const otherStr = createOtherStr(filesValue);
  const baseStr = createBaseCodeRenderStr(codeArr);
  return lastReturnString({ depsStr, indexStr, baseStr, otherStr });
};
