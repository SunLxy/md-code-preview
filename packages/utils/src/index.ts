import { VFile } from "vfile";
import { unified, PluggableList, Processor } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

import gfm from "remark-gfm";
import slug from "rehype-slug";
import headings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeAttrs from "rehype-attr";
import rehypePrism from "rehype-prism-plus";
import rehypeRewrite from "rehype-rewrite";
import style from "style-to-object";

import { getTransformValue } from "./transform";
import { createElementStr } from "./createElement";
import {
  createStr,
  createBaseCodeRenderStr,
  createDepsStr,
  createOtherStr,
  splicingString,
} from "./createStr";
import { rehypeRewriteHandle } from "./rewrite";

import {
  MarkDownTreeType,
  IgnoreRows,
  FilesValueType,
  MarkDownHastNodeTreeType,
  StepOneReturn,
  FilesValueItemType,
  OtherProps,
  GetProcessorOptionsType,
  DepsType,
  DepNamespacesType,
} from "./interface";
export * from "./interface";
export * from "./createElement";
export * from "./createStr";
export * from "./transform";
export * from "./rewrite";

export const getProcessor = (options: GetProcessorOptionsType = {}) => {
  const rehypePlugins: PluggableList = [
    ...(options.rehypePlugins || []),
    [rehypePrism, { ignoreMissing: true }],
    rehypeRaw,
    slug,
    headings,
    [rehypeRewrite, { rewrite: rehypeRewriteHandle }],
    [rehypeAttrs, { properties: "attr" }],
  ];
  const remarkPlugins = [...(options.remarkPlugins || []), gfm];
  const processor = unified()
    .use(remarkParse)
    .use(remarkPlugins)
    .use(remarkRehype, {
      ...(options.remarkRehypeOptions || {}),
      allowDangerousHtml: true,
    })
    .use(rehypePlugins || []);
  return processor;
};

/**
 * @description: markdown 字符串 转换
 * @param {string} scope  读取markdown字符串
 * @param {Processor} processor Processor
 */
export const transformMarkdown = (scope: string, processor: Processor) => {
  const file: any = new VFile();
  file.value = scope;
  const child = processor.parse(file) as MarkDownTreeType;
  return {
    child,
    file,
  };
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
  isLine: boolean
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
  const { isInterval = true, isLine = false } = otherProps || {};
  /** 不需要展示的行 **/
  const ignoreRows: IgnoreRows[] = [];
  /** 行对应的代码 **/
  const filesValue: FilesValueType = {};
  // 第一遍先获取 code 及其标题简介位置之类的
  child.forEach((item, index) => {
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
        ? getIntervalData(index, child, isLine)
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

// ---------------------- 替换 特殊符号 -------------------
export const SymbolMap = new Map([
  ["{", "&#123;"],
  ["}", "&#125;"],
  [">", "&gt;"],
  ["<", "&lt;"],
  ["=", "&#61;"],
  [">=", "&lt;&#61;"],
  ["<=", "&gt;&#61;"],
  ["\\", "&#92;"],
  ["</", "&lt;&#47;"],
  ["=>", "&#61;&gt;"],
  ["/>", "&#47;&gt;"],
]);

export const transformSymbol = (str: string) => {
  let newStr = "";
  str.split("").forEach((va) => {
    const nw = `${va}`.trim();
    if (SymbolMap.has(nw)) {
      newStr += SymbolMap.get(nw);
    } else {
      newStr += va;
    }
  });
  return newStr;
};

export const stringEscape = (str: string) => {
  let newStr = "";
  str.split("").forEach((itemStr) => {
    if (itemStr === "`") {
      newStr += `\\`;
    }
    newStr += itemStr;
  });
  return newStr;
};

const transformStr = (str: string) => {
  const Rg = /-([a-z])/g;
  return str.replace(Rg, function ($0, $1) {
    return $1.toUpperCase();
  });
};
export const styleIterator = (value: string) => {
  const output: Record<string, string> = {};
  const iterator = (name: string, itemValue: any) => {
    const k = name.slice(0, 4) === "-ms-" ? `ms-${name.slice(4)}` : name;
    const keys = transformStr(k);
    output[keys] = itemValue;
  };
  style(value, iterator);
  return output;
};

/**
 * @description: 标签属性 拼接字符串
 * @param {Record<string, unknown>} properties 属性对象
 * @return {string}
 */
export const getProperties = (properties: Record<string, unknown>): string => {
  let str = "";
  Object.entries(properties).forEach(([key, value]) => {
    let newKey = key;
    let newValue = value;
    if (newKey === "ariaHidden") {
      newKey = "aria-hidden";
    }

    if (newKey === "style" && typeof value === "string") {
      newValue = styleIterator(value);
    }

    if (newKey === "data-code") {
      str += ` ${newKey}={\`${stringEscape(newValue as string)}\`} `;
    } else if (typeof newValue === "function") {
      str += ` ${newKey}={${newValue.toString()}} `;
    } else if (Array.isArray(newValue)) {
      str += ` ${newKey}="${newValue.join(" ")}" `;
    } else if (Object.prototype.toString.call(newValue) === "[object Object]") {
      str += ` ${newKey}={${JSON.stringify(newValue)}} `;
    } else if (typeof newValue === "string") {
      str += ` ${newKey}={\`${newValue}\`}`;
    } else {
      str += ` ${newKey}={${newValue}} `;
    }
  });
  return str;
};

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
  const depNamespacesArr: DepNamespacesType[] = [];
  Object.entries(filesValue).forEach(([key, itemValue]) => {
    const { copyNode } = itemValue;
    const { code, depNamespaces, deps } = transformCode(
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
  return splicingString({ depsStr, indexStr, baseStr, otherStr });
};
