import { getTransformValue } from "./transform";
import { FilesValueType } from "./interface";
import {
  stepOne,
  getProcessor,
  transformMarkdown,
  MarkDownHastNodeTreeType,
} from "md-plugin-utils";
import React from "react";

const loopReactDom = (child: MarkDownHastNodeTreeType["children"]) => {
  return child
    .map((item, index) => {
      if (item.children && Array.isArray(item.children) && item.tagName) {
        const children: any = loopReactDom(item.children);
        return React.createElement(
          `${item.tagName}`,
          {
            ...item.properties,
            key: index,
            _store: {
              validated: true,
            },
            $$typeof: Symbol("react.element"),
          },
          children
        );
      } else if (item.tagName) {
        return React.createElement(
          `${item.tagName}`,
          {
            ...item.properties,
            key: index,
            _store: {
              validated: true,
            },
            $$typeof: Symbol("react.element"),
          },
          item.value
        );
      }
      return item.value;
    })
    .filter((item) => item !== "");
};

// loader 中转换
export const markdownParse = (source: string, lang: string[]) => {
  const processor = getProcessor();
  const { file, child } = transformMarkdown(source, processor);
  const result = stepOne(child.children, lang, processor, file, true, true);
  const { filesValue, ignoreRows } = result;
  const newFilesValue: any = {};

  Object.entries(filesValue).forEach(([key, item]) => {
    const filename = `${key}.${item.lang}`;
    const itemValue: FilesValueType = {
      value: item.copyNode,
      transform: getTransformValue(item.copyNode, filename),
      comments: {
        title: item.head,
        description: item.desc,
      },
    };
    newFilesValue[key] = itemValue;
  });

  // const markdownTree = getMD(source) as MarkdownTreeType;
  // const filesValue: Record<number, FilesValueType> = {};
  // const ignoreRows: { start?: number; end?: number }[] = [];

  // markdownTree.children.map((itemChild, index) => {
  //   if (
  //     itemChild &&
  //     itemChild.type === "code" &&
  //     lang.includes(itemChild.lang)
  //   ) {
  //     const line = itemChild.position.start.line;
  //     const filename = `${line}.${itemChild.lang}`;
  //     const space = getSpace(index, markdownTree.children);
  //     if (typeof space.start === "number") {
  //       ignoreRows.push({
  //         start: space.start,
  //         end: space.end,
  //       });
  //     }
  //     const item: FilesValueType = {
  //       value: itemChild.value,
  //       transform: getTransformValue(itemChild.value, filename),
  //       // comments: getCommentParser(itemChild.value),
  //       comments: {
  //         title: space.head,
  //         description: `<div>测试大城市八成</div>`
  //         // description: space.description,
  //       },
  //       // head: space.head,
  //       // description: space.description,
  //     };
  //     filesValue[line] = item;
  //   }
  // });
  return {
    filesValue: newFilesValue,
    ignoreRows,
  };
};
