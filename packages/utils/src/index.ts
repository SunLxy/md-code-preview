import {
  createStr,
  createBaseCodeRenderStr,
  createDepsStr,
  createOtherStr,
  splicingString,
} from "./createStr";
import {
  OtherProps,
  DepsType,
  DepNamespacesType,
  MarkDownHastNodeTreeType,
} from "./interface";
import { getProcessor, transformMarkdown } from "md-unified-utils";
export * from "./interface";
export * from "./createElement";
export * from "./createStr";
export * from "./transform";
export * from "./createPropertie";
export * from "./newAnalysis";
import { newStepTwoTree, newStepOne } from "./newAnalysis";
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
  const {
    mdCodePreviewPath = "md-code-preview",
    isInterval = true,
    options = {},
  } = otherProps;
  const processor = getProcessor(options);
  const { child, file } = transformMarkdown(scope, processor);
  const hastChild = processor.runSync(child, file) as MarkDownHastNodeTreeType;
  const One = newStepOne(child.children, lang, otherProps);
  const { filesValue, indexStr } = newStepTwoTree(
    hastChild.children,
    One.ignoreRows,
    One.filesValue,
    otherProps
  );
  return createStr(filesValue, indexStr, isInterval, mdCodePreviewPath);
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
  otherProps: OtherProps = {}
) => {
  const { mdCodePreviewPath = "md-code-preview", options = {} } = otherProps;
  const processor = getProcessor(options);
  const { child, file } = transformMarkdown(scope, processor);
  const One = newStepOne(child.children, lang, otherProps);
  const hastChild = processor.runSync(child, file) as MarkDownHastNodeTreeType;
  const { filesValue, indexStr } = newStepTwoTree(
    hastChild.children,
    One.ignoreRows,
    One.filesValue,
    otherProps
  );
  const codeArr: string[] = [];
  const depsArr: DepsType[] = [];
  const depDirectsArr: DepNamespacesType[] = [];
  const depNamespacesArr: DepNamespacesType[] = [];
  Object.entries(filesValue).forEach(([key, itemValue]) => {
    const { dependencies } = itemValue;
    const { code, depNamespaces, deps, depDirects, depsName } = dependencies;
    codeArr.push(code);
    depsArr.push(deps);
    depNamespacesArr.push(depNamespaces);
    depDirectsArr.push(depDirects);
  });
  const depsStr = createDepsStr(
    depsArr,
    depNamespacesArr,
    depDirectsArr,
    mdCodePreviewPath
  );
  const otherStr = createOtherStr(filesValue);
  const baseStr = createBaseCodeRenderStr(codeArr);
  return splicingString({
    depsStr,
    indexStr,
    baseStr,
    otherStr,
  });
};
