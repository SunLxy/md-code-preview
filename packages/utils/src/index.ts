import { stepTwo, stepOne } from "./analysis";
import {
  createStr,
  createBaseCodeRenderStr,
  createDepsStr,
  createOtherStr,
  splicingString,
} from "./createStr";
import { OtherProps, DepsType, DepNamespacesType } from "./interface";
import { getProcessor, transformMarkdown } from "md-unified-utils";
export * from "./interface";
export * from "./createElement";
export * from "./createStr";
export * from "./transform";
export * from "./createPropertie";
export * from "./analysis";
export { getProcessor, transformMarkdown };
/**
 * @description: 获取文件夹名称
 * @param {string} resourcePath  文件的绝对路径
 * @param {string} rootContext 项目的根目录绝对路径
 */
export const getFileDirName = (resourcePath: string, rootContext: string) => {
  return resourcePath
    .replace(rootContext, "")
    .split(/\/|\\/)
    .join("")
    .replace(/.md$/, "");
};

/**
 * @description:  最终的返回内容
 * @param {string} scope markdown字符串
 * @param {string} lang 解析代码块的语言
 * @param {OtherProps} otherProps 其他参数
 */
export const createPluginReturn = (
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
  return createStr(filesValue, indexStr);
};

/**------------------ 用以直接创建生成 react文件形式的代码字符串 ---------------------**/
/**
 * @description:  最终的返回内容
 * @param {string} scope markdown字符串
 * @param {string} lang 解析代码块的语言
 * @param {OtherProps} otherProps 其他参数
 */
export const createLoaderRetuen = (
  scope: string,
  lang: string[] = ["jsx", "tsx"],
  transformCode: (
    content: string,
    funName: string
  ) => {
    code: string;
    deps: DepsType;
    depNamespaces: DepNamespacesType;
    depDirects: DepNamespacesType;
  },
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
  const depDirectsArr: DepNamespacesType[] = [];
  const depNamespacesArr: DepNamespacesType[] = [];
  Object.entries(filesValue).forEach(([key, itemValue]) => {
    const { copyNode } = itemValue;
    const { code, depNamespaces, deps, depDirects } = transformCode(
      copyNode,
      `BaseCodeRenderComponent${key}`
    );
    codeArr.push(code);
    depsArr.push(deps);
    depNamespacesArr.push(depNamespaces);
    depDirectsArr.push(depDirects);
  });
  const depsStr = createDepsStr(depsArr, depNamespacesArr, depDirectsArr);
  const otherStr = createOtherStr(filesValue);
  const baseStr = createBaseCodeRenderStr(codeArr);
  return splicingString({ depsStr, indexStr, baseStr, otherStr });
};
