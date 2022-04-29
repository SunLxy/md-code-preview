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

import { getTransformValue } from "./transform";
import { createElementStr } from "./createElement";
import { createStr } from "./createStr";
import { rehypeRewriteHandle } from "./rewrite";

import {
  MarkDownTreeType,
  IgnoreRows,
  FilesValueType,
  MarkDownHastNodeTreeType,
  StepOneReturn,
  FilesValueItemType,
} from "./interface";
export * from "./interface";
export * from "./createElement";
export * from "./createStr";
export * from "./transform";
export * from "./rewrite";

export const getProcessor = () => {
  const rehypePlugins: PluggableList = [
    [rehypePrism, { ignoreMissing: true }],
    rehypeRaw,
    slug,
    headings,
    [rehypeRewrite, { rewrite: rehypeRewriteHandle }],
    [rehypeAttrs, { properties: "attr" }],
  ];
  const remarkPlugins = [gfm];
  const processor = unified()
    .use(remarkParse)
    .use(remarkPlugins)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePlugins || []);
  return processor;
};
/**
 * markdown 字符串 转换
 * */
export const transformMarkdown = (scope: string, processor: Processor) => {
  const file: any = new VFile();
  file.value = scope;
  const child = processor.parse(file) as MarkDownTreeType;
  return {
    child,
    file,
  };
};

// -------------------  jsx  tsx 之类需要展示效果的这种取之间的内容 ----------------
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

/** 根据  child.children 找到 code 代码块及其上面到head之间的位置 */
export const stepOne = (
  child: MarkDownTreeType["children"],
  lang: string[],
  processor: Processor,
  file: any,
  isLine = false,
  isPropertiesString: boolean = false
) => {
  /** 不需要展示的行 **/
  const ignoreRows: IgnoreRows[] = [];
  /** 行对应的代码 **/
  const filesValue: FilesValueType = {};
  // 第一遍先获取 code 及其标题简介位置之类的
  child.forEach((item, index) => {
    if (item.type === "code" && lang.includes(item.lang || "")) {
      const { start, end, desc, head } = getIntervalData(index, child, isLine);
      const line = item.position.start.line;
      const objs: FilesValueItemType = {
        copyNode: item.value,
        lang: item.lang,
        // babel 转换后的 代码，最后需要拼接到结果文件中去的
        transform: getTransformValue(item.value, `${index}.${item.lang}`, line),
      };
      const code = processor.runSync(
        { children: [item], type: "root" } as any,
        file
      ) as any;
      const codeStr = createElementStr(code, isPropertiesString);
      objs.code = codeStr;

      if (typeof start === "number") {
        ignoreRows.push({ start, end: isLine ? line : end });
        const headNode = processor.runSync(
          { children: head, type: "root" } as any,
          file
        ) as any;
        const descNode = processor.runSync(
          { children: desc, type: "root" } as any,
          file
        ) as any;

        const headStr = createElementStr(headNode, isPropertiesString);
        const descStr = createElementStr(descNode, isPropertiesString);
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

// ----------------  查询转转换为dom之后的位置   --------------------
export const stepTwo = (
  stepOneReturn: StepOneReturn,
  child: MarkDownHastNodeTreeType["children"],
  file: any,
  processor: Processor,
  isPropertiesString: boolean = false
) => {
  const { ignoreRows, filesValue } = stepOneReturn;
  let indexStr = ``;
  child.forEach((item, index) => {
    if (isShowNode(ignoreRows, index)) {
      if (filesValue[index]) {
        indexStr += `<MdCodePreview 
        copyNodes={importCopyNodeRender["${index}"]} 
        comments={{
          title:importHeadRender["${index}"],
          description:importDescRender["${index}"]
        }}
        code={importCodeRender["${index}"]}
        >{importBaseCodeRender["${index}"]&&importBaseCodeRender["${index}"]()}</MdCodePreview>`;
      } else {
        const Nodes = processor.runSync(
          { children: [item], type: "root" } as any,
          file
        ) as any;
        const nodeStr = createElementStr(Nodes, isPropertiesString);
        indexStr += nodeStr;
      }
    }
  });
  return createStr(filesValue, indexStr);
};

// -------------   判断是否需要展示 ----------------
export const isShowNode = (ignoreRows: IgnoreRows[] = [], index: number) => {
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
  if (SymbolMap.get(`${str}`.trim())) {
    return SymbolMap.get(`${str}`.trim());
  }
  return str;
};

// ----------------- 标签属性 拼接字符串  --------------------
export const getProperties = (
  properties: Record<string, unknown>,
  isPropertiesString: boolean = false
) => {
  let str = "";
  Object.entries(properties).forEach(([key, value]) => {
    // data-code
    if (key === "ariaHidden") {
      str += isPropertiesString
        ? ` aria-hidden="${value}" `
        : ` aria-hidden={${value}} `;
    } else if (typeof value === "function") {
      str += isPropertiesString
        ? ` ${key}="${value.toString()}" `
        : ` ${key}={${value.toString()}} `;
    } else if (Array.isArray(value)) {
      str += isPropertiesString
        ? ` ${key}="${value.join(" ")}" `
        : ` ${key}="${value.join(" ")}" `;
    } else if (Object.prototype.toString.call(value) === "[object Object]") {
      str += isPropertiesString
        ? ` ${key}="${JSON.stringify(value)}" `
        : ` ${key}={${JSON.stringify(value)}} `;
    } else if (typeof value === "string") {
      str += isPropertiesString
        ? ` ${key}="${value}" `
        : ` ${key}={\`${value}\`}`;
    } else {
      str += isPropertiesString ? ` ${key}="${value}" ` : ` ${key}={${value}} `;
    }
  });
  return str;
};

// 解析文件 对文件内容进行区分生成临时文件，用于显示组件
export const getFileDirName = (resourcePath: string, rootContext: string) => {
  return resourcePath
    .replace(rootContext, "")
    .split(/\/|\\/)
    .join("")
    .replace(/.md$/, "");
};

export const lastReturn = (scope: string, lang: string[] = ["jsx", "tsx"]) => {
  const processor = getProcessor();
  const { child, file } = transformMarkdown(scope, processor);
  const One = stepOne(child.children, lang, processor, file);
  return stepTwo(One, child.children as any, file, processor);
};
