/*
 * @Description: 解析 markdown 树
 */

import { getTransformValue } from "./transform";
import { createElementStr, loop } from "./createElement";
import { transformCode, getConfig } from ".";
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
 * @param {MarkDownTreeType["children"]} child 通过解析的markdown数据
 * @param {string[]} lang 解析代码块的语言
 * @param {MarkDownHastNodeTreeType[]} hastChild 解析转换后的标签树
 * @param {OtherProps} otherProps  其他参数
 */
export const newStepOne = (
  child: MarkDownTreeType["children"],
  lang: string[],
  hastChild: MarkDownHastNodeTreeType[],
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
      /** 判断代码块是否有 export default 导出，如果没有则不进行处理代码块 ***/
      const line = item.position.start.line;
      const result = transformCode(
        item.value,
        `BaseCodeRenderComponent${line}`
      );
      if (!result.isDefault) {
        return;
      }
      /** 获取行内参数  **/
      const newInterval = getCheckIgnore(line, hastChild, isInterval);
      /**  获取开始行  ***/
      const { start, title } = newInterval
        ? getNewIntervalData(index, child)
        : { start: undefined, title: "demo" };
      const objs: FilesValueItemType = {
        value: item.value,
        copyNode: item.value,
        lang: item.lang,
        title: title,
        // babel 转换后的 代码，最后需要拼接到结果文件中去的
        transform: getTransformValue(item.value, `${line}.${item.lang}`, line),
      };
      if (isDeps) {
        objs.dependencies = { ...result };
      }
      if (typeof start === "number" && newInterval) {
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

/**
 * @description: 解析转换后的标签树，进行标签拼接字符串
 * @param {MarkDownHastNodeTreeType[]} hastChild 解析转换后的标签树
 * @param {IgnoreRows[]} ignoreRows 忽略的数据
 * @param {StepOneReturn["filesValue"]} filesValue 行对应的代码数据
 * @param {OtherProps} otherProps  其他参数
 */
export const newStepTwoTree = (
  hastChild: MarkDownHastNodeTreeType[],
  ignoreRows: IgnoreRows[],
  filesValue: StepOneReturn["filesValue"],
  otherProps: OtherProps = {}
) => {
  const { isInterval = true, isDeps = true, codePenOptions = {} } = otherProps;
  const { newTree, filesValue: newFilesValue } = getNewTree(
    hastChild,
    ignoreRows,
    filesValue
  );
  let indexStr = ``;
  newTree.forEach((item, index) => {
    const line = item && item.position && item.position.start.line;
    if (filesValue[line]) {
      /** 去除 className 属性,其他的传递组件中 */
      const { className, ...properties } =
        (item.children[0] || {}).properties || {};
      /** 从属性中获取 isInterval 值 **/
      const currentIsInterval = Reflect.has(properties || {}, "isInterval")
        ? Reflect.get(properties || {}, "isInterval")
        : undefined;
      /** 当前code是否需要进行处理标题和简介 **/
      const newCurrentIsInterval =
        currentIsInterval !== undefined ? currentIsInterval : isInterval;

      if (index === 0 && newCurrentIsInterval) {
        indexStr += `<div className="preview-fieldset-list-9">`;
      } else if (newCurrentIsInterval) {
        /** 获取上一个对象 **/
        const preItem = newTree[index - 1];
        const preLine =
          preItem && preItem.position && preItem.position.start.line;
        const preInterval = getCheckIgnore(preLine, newTree, undefined);
        /** 当默认是false的时候
         * 1. 上一个为默认值时(false),当前有 加
         * 2. 上一个为true 的时候，不加
         * ***/
        if (!isInterval) {
          if (preInterval === true) {
            // 不加
          } else if (!preInterval) {
            // 加
            indexStr += `<div className="preview-fieldset-list">`;
          }
        }
        /** 当默认是true的时候
         * 1. 当上一个是默认的(true) 不加
         * 2. 当上一个是 false 的时候 加
         * 3. 当上一个是 undefined 并且上一个不是渲染块  加
         * 4. 当上一个是 undefined 并且是一个渲染块 ，不加
         * ***/
        if (isInterval) {
          if (
            preInterval ||
            (preInterval === undefined && filesValue[preLine])
          ) {
            // 不加
          } else if (
            preInterval === false ||
            (preInterval === undefined && !filesValue[preLine])
          ) {
            // 加
            indexStr += `<div className="preview-fieldset-list">`;
          }
        }
      }

      const itemDepNames = isDeps ? filesValue[line].dependencies.depsName : [];
      const config = getConfig(properties, {
        ...codePenOptions,
        title: filesValue[line].title,
        code: filesValue[line].copyNode,
        dependencies: itemDepNames,
      });

      indexStr += `<MdCodePreview 
        copyNodes={importCopyNodeRender["${line}"]}
        properties={${JSON.stringify(properties)}}
        comments={{
          title:${
            newCurrentIsInterval ? `importHeadRender["${line}"]` : `undefined`
          },
          description:${
            newCurrentIsInterval ? `importDescRender["${line}"]` : `undefined`
          },
        }}
        code={importCodeRender["${line}"]}
        ${config}
        >{importBaseCodeRender["${line}"]&&importBaseCodeRender["${line}"]()}</MdCodePreview>`;

      if (newCurrentIsInterval) {
        /** 获取下一个对象 **/
        const nextItem = newTree[index + 1];
        if (nextItem) {
          const nextLine =
            nextItem && nextItem.position && nextItem.position.start.line;
          const nextInterval = getCheckIgnore(nextLine, newTree, undefined);
          if (
            (nextInterval === undefined && !filesValue[nextLine]) ||
            nextInterval === false
          ) {
            indexStr += `</div>`;
          }
        } else {
          indexStr += `</div>`;
        }
      }
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
/**
 * @description: 获取最新的渲染的标签树
 * @param {MarkDownHastNodeTreeType[]} hastChild 解析转换后的标签树
 * @param {IgnoreRows[]} ignoreRows 忽略的数据
 * @param {StepOneReturn["filesValue"]} filesValue 行对应的代码数据
 */
export const getNewTree = (
  hastChild: MarkDownHastNodeTreeType[],
  ignoreRows: IgnoreRows[],
  filesValue: StepOneReturn["filesValue"]
) => {
  /** 去除换行符 **/
  const newHastChild = hastChild.filter((item) => {
    if (item.type === "text" && item.value.replace(/\n/g, "") === "") {
      return false;
    }
    return item;
  });
  /** 获取新的忽略的数组下标 **/
  const newIgnoreRows = ignoreRows.map(({ start, end }) => {
    const startIndex = newHastChild.findIndex(
      (item) => item.position && item.position.start.line === start
    );
    const endIndex = newHastChild.findIndex(
      (item) => item.position && item.position.start.line === end
    );
    const space = newHastChild.filter(
      (item) =>
        item.position &&
        item.position.start.line < end &&
        item.position.start.line >= start
    );
    return { start: startIndex, end: endIndex, space };
  });
  /** 判断当前数组下标是否隐藏 **/
  const checkHide = (index: number) => {
    const findx = newIgnoreRows.findIndex(
      ({ start, end }) => index >= start && index < end
    );
    return findx >= 0;
  };
  /** 判断当前数组下标是否是需要预览的code代码块 **/
  const checkEnd = (index: number) => {
    const findx = newIgnoreRows.find(({ end }) => index === end);
    return findx;
  };
  /** 生成新的渲染树 **/
  const newTree = newHastChild
    .map((item, index) => {
      const line = item && item.position && item.position.start.line;
      if (checkHide(index)) {
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
  let title = "";
  let start;
  const loop = () => {
    const item = child[current];
    if (item && item.type === "heading") {
      start = item.position.start.line;
      title =
        (Array.isArray(item.children) && item.children[0]?.value) || "demo";
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
  return {
    start,
    title,
  };
};

/**
 * @description: 获取属性，判断是否需要忽略标题和简介部分
 * @param {number} line
 * @param {MarkDownHastNodeTreeType[]} hastChild
 * @param {boolean|undefined} isInterval
 */
export const getCheckIgnore = (
  line: number,
  hastChild: MarkDownHastNodeTreeType[],
  isInterval: boolean | undefined
) => {
  const item = hastChild.find(
    (item) => item.position && item.position.start.line === line
  );
  if (item && Array.isArray(item.children)) {
    const properties = (item.children[0] || {}).properties || {};
    if (Reflect.has(properties, "isInterval")) {
      return Reflect.get(properties, "isInterval");
    }
  }
  return isInterval;
};
