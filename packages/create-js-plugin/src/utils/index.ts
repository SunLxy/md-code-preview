import { VFile } from "vfile";
import { unified, PluggableList } from "unified";
import remarkParse from "remark-parse";
import remarkRehype, { one } from "remark-rehype";

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
  OtherMapType,
} from "./interface";
export * from "./interface";
/**
 * markdown 字符串 转换
 * */
export const transformMarkdown = (scope: string) => {
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
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypePlugins || []);
  const file: any = new VFile();
  file.value = scope;
  const child = processor.parse(file) as MarkDownTreeType;
  const hastNode = processor.runSync(child, file) as MarkDownHastNodeTreeType;
  return {
    child,
    hastNode,
  };
};

// -------------------  jsx  tsx 之类需要展示效果的这种取之间的内容 ----------------
export const getIntervalData = (
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
  return {
    start,
    end:
      typeof start === "number"
        ? child[endIndex].position.start.line
        : undefined,
  };
};

/** 根据  child.children 找到 code 代码块及其上面到head之间的位置 */
export const stepOne = (child: MarkDownTreeType["children"]) => {
  /** 不需要展示的行 **/
  const ignoreRows: IgnoreRows[] = [];
  /** 行对应的代码 **/
  const filesValue: FilesValueType = {};
  // 第一遍先获取 code 及其标题简介位置之类的
  child.forEach((item, index) => {
    const line = item.position.start.line;
    if (item.type === "code" && ["jsx", "tsx"].includes(item.lang || "")) {
      const { start, end } = getIntervalData(index, child);
      if (typeof start === "number") {
        ignoreRows.push({
          start,
          end,
          line,
        });
      }
      filesValue[line] = {
        value: item.value,
        // babel 转换后的 代码，最后需要拼接到结果文件中去的
        transform: getTransformValue(item.value, `${index}.${item.lang}`, line),
      };
    }
  });
  return {
    ignoreRows,
    filesValue,
  };
};

// ----------------  查询转转换为dom之后的位置   --------------------
export const stepTwo = (
  ignoreRows: IgnoreRows[],
  child: MarkDownHastNodeTreeType["children"]
) => {
  return ignoreRows.map((item) => {
    const findIndexStart = child.findIndex(
      (it) =>
        it.type === "element" &&
        it.position &&
        it.position.start.line === item.start
    );
    const findIndexEnd = child.findIndex(
      (it) =>
        it.type === "element" &&
        it.position &&
        it.position.start.line === item.end
    );
    return {
      start: findIndexStart,
      end: findIndexEnd,
      line: item.line,
    };
  });
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
export const getProperties = (properties: Record<string, unknown>) => {
  let str = "";
  Object.entries(properties).forEach(([key, value]) => {
    // data-code
    if (key === "ariaHidden") {
      str += ` aria-hidden={${value}} `;
    } else if (typeof value === "function") {
      str += ` ${key}={${value.toString()}} `;
    } else if (Array.isArray(value)) {
      str += ` ${key}="${value.join(" ")}" `;
    } else if (Object.prototype.toString.call(value) === "[object Object]") {
      str += ` ${key}={${JSON.stringify(value)}} `;
    } else if (typeof value === "string") {
      str += ` ${key}={\`${value}\`}`;
    } else {
      str += ` ${key}={${value}} `;
    }
  });
  return str;
};

/** 获取代码块以上到标题部分数据  **/
export const getIntervalStr = (
  newIgnore: IgnoreRows[],
  oline: number,
  newPreMap: Map<number, any>
) => {
  const result = newIgnore.find((item) => item.line === oline);
  const { start, end, line } = result || {};
  const head = newPreMap.get(start);
  let desc = ``;
  let i = start;
  while (i < end) {
    i++;
    desc += newPreMap.get(i) || "";
  }
  return {
    head,
    desc,
    line,
  };
};

// 解析文件 对文件内容进行区分生成临时文件，用于显示组件
export const getFileDirName = (resourcePath: string, rootContext: string) => {
  return resourcePath
    .replace(rootContext, "")
    .split(/\/|\\/)
    .join("")
    .replace(/.md$/, "");
};

export const lastReturn = (scope: string) => {
  const { child, hastNode } = transformMarkdown(scope);
  const One = stepOne(child.children);
  const newIgnoreRows = stepTwo(One.ignoreRows, hastNode.children);
  const newPreMap: Map<number, any> = new Map([]);
  const newOtherMap: OtherMapType = new Map([]);
  const result = createElementStr(
    hastNode,
    { ...One, ignoreRows: newIgnoreRows },
    true,
    newPreMap,
    newOtherMap
  );
  return createStr({ ...result, filesValue: One.filesValue });
};
