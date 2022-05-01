import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import generate from "@babel/generator";
import { DepsType, DepNamespacesType } from ".";

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
  const depDirects: DepNamespacesType = {};

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
        if (node.specifiers.length) {
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
        } else {
          depDirects[keys] = keys;
        }
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
    depDirects,
  };
};
