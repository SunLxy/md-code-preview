import unified from "unified";
import remarkParse from "remark-parse";
import FS from "fs-extra";
import path from "path";
import { getTransformValue } from "./transform";
import { parse as jestDocblockParse } from "jest-docblock";

export type StartAndEndType = {
  column: number;
  offset: number;
  line: number;
};

export type PositionType = {
  start: StartAndEndType;
  end: StartAndEndType;
};

export type MarkdownTreeType = {
  children: {
    lang: string;
    meta: any;
    type: string;
    value: string;
    position: PositionType;
  }[];
  position: PositionType;
  type: string;
};

export type FilesValueType = {
  filename?: string;
  value?: string;
  path?: string;
  transform?: string;
  comments?: CommentsType;
};

export type CommentsType = {
  title?: string;
  description?: string;
  [k: string]: string;
};

// @ts-ignore
export const getMD = (str: string) => unified().use(remarkParse).parse(str);

// 解析文件 对文件内容进行区分生成临时文件，用于显示组件
export const getFileDirName = (resourcePath: string, rootContext: string) => {
  return resourcePath
    .replace(rootContext, "")
    .split(/\/|\\/)
    .join("")
    .replace(/.md$/, "");
};

const removeColon = (key: string) => {
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

// loader 中转换
export const markdownParse = (source: string, lang: string[]) => {
  const markdownTree = getMD(source) as MarkdownTreeType;
  const filesValue: Record<number, FilesValueType> = {};

  markdownTree.children.map((itemChild) => {
    if (
      itemChild &&
      itemChild.type === "code" &&
      lang.includes(itemChild.lang)
    ) {
      const line = itemChild.position.start.line;
      const filename = `${line}.${itemChild.lang}`;
      const item: FilesValueType = {
        value: itemChild.value,
        transform: getTransformValue(itemChild.value, filename),
        comments: getCommentParser(itemChild.value),
      };
      filesValue[line] = item;
    }
  });
  return filesValue;
};

// plugin 中转换
export const markdownParsePlugin = (
  source: string,
  fileDirName: string,
  savePath: string,
  lang: string[] = ["jsx", "tsx"]
) => {
  const dirPath = path.join(savePath, fileDirName);
  // 置空文件夹
  FS.emptyDirSync(dirPath);

  const markdownTree = getMD(source) as MarkdownTreeType;
  const filesValue: Record<number, FilesValueType> = {};

  markdownTree.children.map((itemChild) => {
    if (
      itemChild &&
      itemChild.type === "code" &&
      lang.includes(itemChild.lang)
    ) {
      const line = itemChild.position.start.line;
      const filename = `${line}.${itemChild.lang}`;
      const item: FilesValueType = {
        filename,
        value: itemChild.value,
        comments: getCommentParser(itemChild.value),
        path: `${fileDirName}/${filename}`,
      };
      FS.writeFileSync(`${dirPath}/${filename}`, itemChild.value, {
        flag: "w+",
        encoding: "utf-8",
      });
      filesValue[line] = item;
    }
  });
  return filesValue;
};
