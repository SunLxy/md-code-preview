/*
 * @Description: 解析 markdown 树
 */

import { Processor } from "unified";
import { getTransformValue } from "./transform";
import { createElementStr } from "./createElement";
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
 * @param {Processor} processor Processor
 * @param {any} file new VFile()赋值后的值
 * @param {OtherProps} otherProps  其他参数
 */
export const stepOne = (
  child: MarkDownTreeType["children"],
  lang: string[],
  processor: Processor,
  file: any,
  otherProps: OtherProps = {}
) => {
  const { isInterval = true, isLine = false, isDeps = true } = otherProps || {};
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
      const { start, end, desc, head } = isInterval
        ? getIntervalData(index, child)
        : {
            start: undefined,
            end: undefined,
            desc: undefined,
            head: undefined,
          };

      const line = item.position.start.line;
      const objs: FilesValueItemType = {
        value: item.value,
        copyNode: item.value,
        lang: item.lang,
        // babel 转换后的 代码，最后需要拼接到结果文件中去的
        transform: getTransformValue(item.value, `${index}.${item.lang}`, line),
      };

      if (isDeps) {
        objs.dependencies = transformCode(
          item.value,
          `BaseCodeRenderComponent${isLine ? line : index}`
        );
      }

      const code = processor.runSync(
        { children: [item], type: "root" } as any,
        file
      ) as any;
      const codeStr = createElementStr(code);
      objs.code = codeStr;

      if (typeof start === "number" && isInterval) {
        ignoreRows.push({ start, end: isLine ? line : end });
        const headNode = processor.runSync(
          { children: head, type: "root" } as any,
          file
        ) as any;
        const descNode = processor.runSync(
          { children: desc, type: "root" } as any,
          file
        ) as any;

        const headStr = createElementStr(headNode);
        const descStr = createElementStr(descNode);
        objs.head = headStr;
        objs.desc = descStr;
      }
      if (isLine) {
        filesValue[line] = objs;
      } else {
        filesValue[index] = objs;
      }
    }
  });
  return {
    ignoreRows,
    filesValue,
  };
};

/**
 * @description: 查询转转换为dom之后的位置
 * @param {StepOneReturn} stepOneReturn 第一步的返回值
 * @param {MarkDownHastNodeTreeType["children"]} child 通过解析的markdown数据
 * @param {any} file new VFile()赋值后的值
 * @param {Processor} processor Processor
 * @param {OtherProps} otherProps  其他参数
 */
export const stepTwo = (
  stepOneReturn: StepOneReturn,
  child: MarkDownHastNodeTreeType["children"],
  file: any,
  processor: Processor,
  otherProps: OtherProps = {}
) => {
  const { isInterval = true } = otherProps || {};
  const { ignoreRows, filesValue } = stepOneReturn;
  let indexStr = ``;
  child.forEach((item, index) => {
    if (isShowNode(ignoreRows, index)) {
      if (filesValue[index]) {
        indexStr += `<MdCodePreview 
        copyNodes={importCopyNodeRender["${index}"]} 
        comments={{
          title:${isInterval ? `importHeadRender["${index}"]` : `undefined`},
          description:${
            isInterval ? `importDescRender["${index}"]` : `undefined`
          },
        }}
        code={importCodeRender["${index}"]}
        >{importBaseCodeRender["${index}"]&&importBaseCodeRender["${index}"]()}</MdCodePreview>`;
      } else {
        const Nodes = processor.runSync(
          { children: [item], type: "root" } as any,
          file
        ) as any;
        const nodeStr = createElementStr(Nodes);
        indexStr += nodeStr;
      }
    }
  });
  return {
    filesValue,
    indexStr,
  };
};

/**
 * @description: 判断是否需要展示
 * @param {IgnoreRows} ignoreRows 忽略的对象
 * @param {number} index 当前位置下标
 * @return {boolean}
 */
export const isShowNode = (
  ignoreRows: IgnoreRows[] = [],
  index: number
): boolean => {
  let isShow = true;
  let i = 0;
  let lg = ignoreRows.length;
  while (i < lg) {
    const { start, end } = ignoreRows[i];
    if (start <= index && index < end) {
      isShow = false;
      break;
    }
    i++;
  }
  return isShow;
};

/**
 * @description: 解析代码块以上到标题之间的内容并合并到展示组件中
 * @param {number} endIndex 当前数组的下标
 * @param {MarkDownTreeType["children"]} child 通过解析的markdown数据
 * @param {boolean} isLine  是否是所属的行赋值还是数组下标进行赋值
 */
export const getIntervalData = (
  endIndex: number,
  child: MarkDownTreeType["children"],
  isLine: boolean = true
) => {
  // 结束的下标
  // 到第一个heading结束
  let current = endIndex - 1;
  let start;
  let desc: MarkDownTreeType["children"] = [];
  let head: MarkDownTreeType["children"] = [];
  const loop = () => {
    const item = child[current];
    if (item && item.type === "heading") {
      start = isLine ? item.position.start.line : current;
      head.push(item);
      current = -1;
    } else if (item && item.type === "code") {
      current = -1;
    } else {
      current = current - 1;
    }
    if (current !== -1) {
      loop();
      desc.push(item);
    }
  };
  loop();
  return {
    start,
    end: endIndex,
    desc,
    head,
  };
};
