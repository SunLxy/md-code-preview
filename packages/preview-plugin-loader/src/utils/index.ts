import unified from "unified";
import remarkParse from "remark-parse";
import { parse as jestDocblockParse } from "jest-docblock";
import toHast from "mdast-util-to-hast";
import toHtml from "hast-util-to-html";
export * from "./plugin";
export * from "./loader";
export * from "./interface";
import { MarkdownTreeType, CommentsType } from "./interface";

// @ts-ignore
export const getMD = (str: string) => unified().use(remarkParse).parse(str);

export const getCodeString = (data: any[] = [], code: string = "") => {
  data.forEach((node) => {
    if (node.type === "text") {
      code += node.value;
    } else if (
      node.type === "element" &&
      node.children &&
      Array.isArray(node.children)
    ) {
      code += getCodeString(node.children);
    }
  });
  return code;
};

export const getHtml = (
  children: MarkdownTreeType["children"],
  isHead = false
) => {
  const hast: any = toHast({
    children,
    type: "root",
  } as any);
  if (isHead) {
    return getCodeString(hast.children || []);
  }
  const html = toHtml(hast);
  return html;
};

// jsx  tsx 之类需要展示效果的这种取之间的内容
export const getSpace = (
  endIndex: number,
  child: MarkdownTreeType["children"]
) => {
  // 结束的下标
  const space: MarkdownTreeType["children"] = [];
  const head: MarkdownTreeType["children"] = [];
  // 到第一个heading结束
  let current = endIndex - 1;
  let start: any;
  const loop = () => {
    const item = child[current];
    if (item && item.type === "heading") {
      start = item.position.start.line;
      current = -1;
      head.push(item);
    } else if (item && item.type === "code") {
      current = -1;
    } else {
      current = current - 1;
      space.unshift(item);
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
    description: getHtml(space),
    head: getHtml(head, true),
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

export const removeColon = (key: string) => {
  return key.replace(/:$/, "");
};

// 解析注释内容
export const getCommentParser = (source: string) => {
  // 默认解析第一个注释内容
  const comments: CommentsType = {};
  const parsed = jestDocblockParse(source);
  Object.entries(parsed).forEach(([key, value]) => {
    // 解析字段一样时，取数组的第一个
    if (Array.isArray(value)) {
      comments[removeColon(key)] = value[0];
    } else {
      comments[removeColon(key)] = value;
    }
  });
  return comments;
};
