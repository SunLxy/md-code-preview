import FS from "fs-extra";
import path from "path";
import { FilesValueType } from ".";
import { stepOne, getProcessor, transformMarkdown } from "md-plugin-utils";

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
  const processor = getProcessor();
  const { file, child } = transformMarkdown(source, processor);
  const newfilesValue: Record<string, FilesValueType> = {};
  const { filesValue, ignoreRows } = stepOne(
    child.children,
    lang,
    getProcessor(),
    file,
    true,
    true
  );

  Object.entries(filesValue).forEach(([key, item]) => {
    const { copyNode, head, desc, lang } = item;
    const filename = `${key}.${lang}`;
    const itemValue: FilesValueType = {
      filename,
      value: copyNode,
      comments: {
        title: head,
        description: desc,
      },
      path: `${fileDirName}/${filename}`,
    };
    newfilesValue[key] = itemValue;
    FS.writeFileSync(`${dirPath}/${filename}`, copyNode, {
      flag: "w+",
      encoding: "utf-8",
    });
  });

  return {
    filesValue: newfilesValue,
    ignoreRows,
  };
};
