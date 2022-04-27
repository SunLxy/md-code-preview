import FS from "fs-extra";
import path from "path";
import { getSpace, getMD, MarkdownTreeType, FilesValueType } from ".";

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
