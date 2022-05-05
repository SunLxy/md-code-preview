import FS from "fs-extra";
import path from "path";
import {
  getProcessor,
  transformMarkdown,
  getNewTree,
  newStepOne,
  MarkDownHastNodeTreeType,
  GetProcessorOptionsType,
} from "md-plugin-utils";

// plugin 中转换
export const markdownParsePlugin = (
  source: string,
  fileDirName: string,
  savePath: string,
  lang: string[] = ["jsx", "tsx"],
  isInterval: boolean,
  mdCodePreviewPath: string = "md-code-preview",
  options: GetProcessorOptionsType = {}
) => {
  const dirPath = path.join(savePath, fileDirName);
  const others = { isInterval, isDeps: false, mdCodePreviewPath, options };
  // 置空文件夹
  FS.emptyDirSync(dirPath);
  const processor = getProcessor();
  const { file, child } = transformMarkdown(source, processor);
  const hastChild = processor.runSync(child, file) as MarkDownHastNodeTreeType;
  const One = newStepOne(child.children, lang, hastChild.children, others);
  const { filesValue } = getNewTree(
    hastChild.children,
    One.ignoreRows,
    One.filesValue,
    others
  );
  const { ignoreRows } = One;
  let initStr = ``;
  if (Array.isArray(ignoreRows) && ignoreRows.length) {
    initStr += `ignoreRows:${JSON.stringify(ignoreRows)},\n`;
  }
  Object.entries(filesValue).forEach(([key, item]) => {
    const { copyNode, head, desc, lang } = item;
    const filename = `${key}.${lang}`;
    initStr += `
      ${key}:{
        filename:\`${filename}\`,
        value:\`${copyNode}\`,
        comments:{title:${
          head ? `<React.Fragment>${head}</React.Fragment>` : "``"
        },description:${
      desc ? `<React.Fragment>${desc}</React.Fragment>` : "``"
    }},
        path:\`${fileDirName}/${filename}\`,
      },\n
    `;
    FS.writeFileSync(`${dirPath}/${filename}`, copyNode, {
      flag: "w+",
      encoding: "utf-8",
    });
  });

  return initStr;
};
