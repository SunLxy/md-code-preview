import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import generate from "@babel/generator";
import webpack from "webpack";
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
import getCacheIdentifier from "react-dev-utils/getCacheIdentifier";

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

/**
 * 最终的结果返回 react 代码
 * ***/
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
 * 1. 解析代码 获取需要渲染的代码块和标题简介部分
 * 2. 对转换好的代码进行字符串化，并拼接好渲染的代码块(解析代码块的依赖，渲染的代码块不需要进行转换，只移出 import/require 引入)
 * 3. 添加渲染代码块的组件字符串
 * 4. 所有内容拼接成一个字符串
 * 5. 通过babel-loader 进行转换成模块
 * 6. 返回babel-loder 结果
 * 7. 页面渲染
 * ***/
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

/** 判断是否引入 react/jsx-runtime **/
const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === "true") {
    return false;
  }

  try {
    require.resolve("react/jsx-runtime");
    return true;
  } catch (e) {
    return false;
  }
})();

/** 配置react代码的babel-loader */
const getBabelLoader = () => {
  const webpackEnv = process.env.NODE_ENV;
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";

  return {
    loader: require.resolve("babel-loader"),
    options: {
      customize: require.resolve("babel-preset-react-app/webpack-overrides"),
      presets: [
        [
          require.resolve("babel-preset-react-app"),
          {
            runtime: hasJsxRuntime ? "automatic" : "classic",
          },
        ],
      ],
      // @remove-on-eject-begin
      babelrc: false,
      configFile: false,
      // Make sure we have a unique cache identifier, erring on the
      // side of caution.
      // We remove this when the user ejects because the default
      // is sane and uses Babel options. Instead of options, we use
      // the react-scripts and babel-preset-react-app versions.
      cacheIdentifier: getCacheIdentifier(
        isEnvProduction ? "production" : isEnvDevelopment && "development",
        [
          "babel-plugin-named-asset-import",
          "babel-preset-react-app",
          "react-dev-utils",
          "react-scripts",
        ]
      ),
      // // @remove-on-eject-end
      // plugins: [
      //   isEnvDevelopment &&
      //   shouldUseReactRefresh &&
      //   require.resolve('react-refresh/babel'),
      // ].filter(Boolean),
      // This is a feature of `babel-loader` for webpack (not Babel itself).
      // It enables caching results in ./node_modules/.cache/babel-loader/
      // directory for faster rebuilds.
      cacheDirectory: true,
      // See #6846 for context on why cacheCompression is disabled
      cacheCompression: false,
      compact: isEnvProduction,
    },
  };
};

/**
 * 配置好markdown的loader
 * @param {webpack.Configuration} config webpack配置
 * @param {boolean} isInterval 是否需要解析代码块以上到标题之间的内容并合并到展示组件中
 * @returns {webpack.Configuration}
 * **/
export const mdCodeModulesLoader = (
  config: webpack.Configuration,
  isInterval: boolean = true
): webpack.Configuration => {
  config.module.rules.forEach((ruleItem) => {
    if (typeof ruleItem === "object") {
      if (ruleItem.oneOf) {
        ruleItem.oneOf.unshift({
          test: /.md$/,
          use: [
            getBabelLoader(),
            {
              loader: "md-code-preview-plugin-loader",
              options: { isInterval },
            },
          ],
        });
      }
    }
  });
  return config;
};
