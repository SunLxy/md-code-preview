import { getTransformValue } from "./transform";
import { MarkdownTreeType, FilesValueType } from "./interface";
import { getSpace, getMD } from ".";

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
