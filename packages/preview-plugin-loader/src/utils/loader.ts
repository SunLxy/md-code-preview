import { getTransformValue } from "./transform";
import { FilesValueType } from "./interface";
import { stepOne, getProcessor, transformMarkdown } from "md-plugin-utils";

// loader 中转换
export const markdownParse = (
  source: string,
  lang: string[],
  isInterval: boolean = true
) => {
  const processor = getProcessor();
  const { file, child } = transformMarkdown(source, processor);
  const result = stepOne(child.children, lang, processor, file, {
    isLine: true,
    isPropertiesString: true,
    isInterval,
  });
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
  return {
    filesValue: newFilesValue,
    ignoreRows,
  };
};
