/*
 * @Description: 解析 markdown 树
 */

import { getTransformValue } from "./transform";
import { createElementStr, loop } from "./createElement";
import { transformCode } from ".";
import {
  MarkDownTreeType,
  IgnoreRows,
  FilesValueType,
  MarkDownHastNodeTreeType,
  StepOneReturn,
  FilesValueItemType,
  OtherProps,
} from "./interface";

/**
 * @description: 根据  child.children 找到 code 代码块及其上面到head之间的位置
 * @param {MarkDownHastNodeTreeType["children"]} child 通过解析的markdown数据
 * @param {string[]} lang 解析代码块的语言
 * @param {OtherProps} otherProps  其他参数
 */
export const newStepOne = (
  child: MarkDownTreeType["children"],
  lang: string[],
  otherProps: OtherProps = {}
) => {
  const { isInterval = true, isDeps = true } = otherProps || {};
  /** 不需要展示的行 **/
  const ignoreRows: IgnoreRows[] = [];
  /** 行对应的代码 **/
  const filesValue: FilesValueType = {};
  // 第一遍先获取 code 及其标题简介位置之类的
  child.forEach((item, index) => {
    /** 判断代码块是否有 export default 导出，如果没有则不进行处理代码块 ***/
    const isExportDefault =
      typeof item.value === "string"
        ? /export default/.test(item.value)
        : false;
    if (
      item.type === "code" &&
      lang.includes(item.lang || "") &&
      isExportDefault
    ) {
      const start = isInterval ? getNewIntervalData(index, child) : undefined;
      const line = item.position.start.line;
      const objs: FilesValueItemType = {
        value: item.value,
        copyNode: item.value,
        lang: item.lang,
        // babel 转换后的 代码，最后需要拼接到结果文件中去的
        transform: getTransformValue(item.value, `${line}.${item.lang}`, line),
      };
      if (isDeps) {
        objs.dependencies = transformCode(
          item.value,
          `BaseCodeRenderComponent${line}`
        );
      }
      if (typeof start === "number" && isInterval) {
        ignoreRows.push({ start, end: line });
      }
      filesValue[line] = objs;
    }
  });
  return {
    ignoreRows,
    filesValue,
  };
};

/** 获取新的渲染树 */
export const newStepTwoTree = (
  hastChild: MarkDownHastNodeTreeType[],
  ignoreRows: IgnoreRows[],
  filesValue: StepOneReturn["filesValue"],
  isDeps: boolean = true,
  otherProps: OtherProps = {}
) => {
  const { isInterval } = otherProps;
  const { newTree, filesValue: newFilesValue } = getNewTree(
    hastChild,
    ignoreRows,
    filesValue,
    otherProps
  );
  let indexStr = ``;
  newTree.forEach((item) => {
    const line = item && item.position && item.position.start.line;
    if (filesValue[line]) {
      const properties = (item.children[0] || {}).properties || {};
      indexStr += `<MdCodePreview 
        copyNodes={importCopyNodeRender["${line}"]}
        properties={${JSON.stringify(properties)}}
        comments={{
          title:${isInterval ? `importHeadRender["${line}"]` : `undefined`},
          description:${
            isInterval ? `importDescRender["${line}"]` : `undefined`
          },
        }}
        ${
          isDeps
            ? `dependenciesArr={dependenciesObject&&dependenciesObject["${line}"]||[]}`
            : ""
        }
        code={importCodeRender["${line}"]}
        >{importBaseCodeRender["${line}"]&&importBaseCodeRender["${line}"]()}</MdCodePreview>`;
    } else {
      const nodeStr = createElementStr(item);
      indexStr += nodeStr;
    }
  });
  return {
    indexStr,
    filesValue: newFilesValue,
  };
};

export const getNewTree = (
  hastChild: MarkDownHastNodeTreeType[],
  ignoreRows: IgnoreRows[],
  filesValue: StepOneReturn["filesValue"],
  otherProps: OtherProps = {}
) => {
  const { isInterval } = otherProps;
  const newIgnoreRows = ignoreRows.map(({ start, end }) => {
    const startIndex = hastChild.findIndex(
      (item) => item.position && item.position.start.line === start
    );
    const endIndex = hastChild.findIndex(
      (item) => item.position && item.position.start.line === end
    );
    const space = hastChild.filter(
      (item) =>
        item.position &&
        item.position.start.line < end &&
        item.position.start.line >= start
    );
    return { start: startIndex, end: endIndex, space };
  });
  const checkHide = (index: number) => {
    const findx = newIgnoreRows.findIndex(
      ({ start, end }) => index >= start && index < end
    );
    return findx >= 0;
  };

  const checkEnd = (index: number) => {
    const findx = newIgnoreRows.find(({ end }) => index === end);
    return findx;
  };
  /** 生成新的渲染树 **/
  const newTree = hastChild
    .map((item, index) => {
      const line = item && item.position && item.position.start.line;
      if (isInterval && checkHide(index)) {
        return false;
      } else if (filesValue[line]) {
        const result = checkEnd(index);
        const [head, ...desc] = (result && result.space) || [];
        filesValue[line]["head"] = createElementStr(head);
        filesValue[line]["desc"] = loop(desc);
        filesValue[line]["code"] = createElementStr(item, 1);
      }
      return item;
    })
    .filter(Boolean) as MarkDownHastNodeTreeType[];
  return {
    filesValue,
    newTree,
  };
};

/**
 * @description: 解析代码块以上到标题之间的内容并合并到展示组件中
 * @param {number} endIndex 当前数组的下标
 * @param {MarkDownTreeType["children"]} child 通过解析的markdown数据
 */
export const getNewIntervalData = (
  endIndex: number,
  child: MarkDownTreeType["children"]
) => {
  // 结束的下标
  // 到第一个heading结束
  let current = endIndex - 1;
  let start;
  const loop = () => {
    const item = child[current];
    if (item && item.type === "heading") {
      start = item.position.start.line;
      current = -1;
    } else if (item && item.type === "code") {
      current = -1;
    } else {
      current = current - 1;
    }
    if (current !== -1) {
      loop();
    }
  };
  loop();
  return start;
};
