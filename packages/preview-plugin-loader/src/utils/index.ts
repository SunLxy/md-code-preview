import unified from "unified";
import remarkParse from "remark-parse";
import FS from "fs-extra";
import path from "path";
import { getTransformValue, getTransformValue2 } from "./transform";
import { parse as jestDocblockParse } from "jest-docblock";
import toHast from "mdast-util-to-hast";
import toHtml from "hast-util-to-html";

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
    children?: MarkdownTreeType[];
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
  head?: string;
  description?: string;
};

export type CommentsType = {
  title?: string;
  description?: string;
  [k: string]: string;
};

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
  const ignoreRows: { start?: number; end?: number }[] = [];

  markdownTree.children.map((itemChild, index) => {
    if (
      itemChild &&
      itemChild.type === "code" &&
      lang.includes(itemChild.lang)
    ) {
      const line = itemChild.position.start.line;
      const filename = `${line}.${itemChild.lang}`;
      const space = getSpace(index, markdownTree.children);
      if (typeof space.start === "number") {
        ignoreRows.push({
          start: space.start,
          end: space.end,
        });
      }
      const item: FilesValueType = {
        value: itemChild.value,
        transform: getTransformValue(itemChild.value, filename),
        // comments: getCommentParser(itemChild.value),
        comments: {
          title: space.head,
          description: space.description,
        },
        // head: space.head,
        // description: space.description,
      };
      filesValue[line] = item;
    }
  });
  return {
    filesValue,
    ignoreRows,
  };
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
  const ignoreRows: { start?: number; end?: number }[] = [];
  const markdownTree = getMD(source) as MarkdownTreeType;
  const filesValue: Record<number, FilesValueType> = {};

  markdownTree.children.map((itemChild, index) => {
    if (
      itemChild &&
      itemChild.type === "code" &&
      lang.includes(itemChild.lang)
    ) {
      const line = itemChild.position.start.line;
      const filename = `${line}.${itemChild.lang}`;
      const space = getSpace(index, markdownTree.children);
      if (typeof space.start === "number") {
        ignoreRows.push({
          start: space.start,
          end: space.end,
        });
      }
      const item: FilesValueType = {
        filename,
        value: itemChild.value,
        // comments: getCommentParser(itemChild.value),
        comments: {
          title: space.head,
          description: space.description,
        },
        path: `${fileDirName}/${filename}`,
        // head: space.head,
        // description: space.description,
      };
      FS.writeFileSync(`${dirPath}/${filename}`, itemChild.value, {
        flag: "w+",
        encoding: "utf-8",
      });
      filesValue[line] = item;
    }
  });
  return {
    filesValue,
    ignoreRows,
  };
};

const isShowNode = (
  ignoreRows: { start: number; end: number }[] = [],
  line: number
) => {
  let isShow = false;
  let i = 0;
  let lg = ignoreRows.length;
  while (i < lg) {
    const { start, end } = ignoreRows[i];
    if (start <= line && line < end) {
      isShow = true;
      break;
    }
    i++;
  }
  return isShow;
};

// plugin 中转换
export const markdownParseCreateComponentPlugin = (
  source: string,
  lang: string[] = ["jsx", "tsx"]
) => {
  // 先做代码转换
  // @ts-ignore
  const markd = unified().use(remarkParse).parse(source);
  // @ts-ignore
  const child = markd.children || [];
  const ignoreRows: any = [];
  const filesValue: any = {};

  // 第一遍先获取 code 及其标题简介之类的
  child.forEach((item: any, index: any) => {
    if (item.type === "code" && lang.includes(item.lang || "")) {
      const { start, end, head, description } = getSpace(index, child);
      if (typeof start === "number") {
        ignoreRows.push({
          start,
          end,
        });
      }
      filesValue[index] = {
        head,
        description,
        value: item.value,
        fun: `baseDom${index}`,
      };
    }
  });

  let renderStr = ``;
  let baseComponent = ``;

  child.forEach((item: any, index: any) => {
    const line = item.position.start.line;
    if (isShowNode(ignoreRows, line)) {
      return;
    }
    if (
      item.type === "code" &&
      lang.includes(item.lang || "") &&
      filesValue[index]
    ) {
      const { head, value, description, fun } = filesValue[index];
      const code = getTransformValue2(value, `${fun}.${item.lang}`);
      baseComponent += `
      function ${fun}(){
        ${code}
      }\n`;
      renderStr += `<Code head={${JSON.stringify(
        head
      )}} value={${JSON.stringify(value)}} desc={${JSON.stringify(
        description
      )}} >{${fun}()}</Code> \n `;
    } else if (item.type === "code") {
      renderStr += `<pre><code className="language-${
        item.lang
      }" children={\`${getHtml([item], true)}\`}  ></code></pre>`;
    } else {
      renderStr += `${getHtml([item])} \n `;
    }
  });

  const render = `
  import React from "react"
  ${baseComponent}\n
  const Code = (props) => {
  return <div>
    {props.children}
  </div>
}
  export default ()=>{
    return <React.Fragment>
    ${renderStr}
    </React.Fragment>
  }
  `;
  return render;
};
