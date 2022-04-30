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

/**
 * @description:  最终的返回内容
 * @param {string} scope markdown字符串
 * @param {string} lang 解析代码块的语言
 */
export const lastReturnString = (
  scope: string,
  lang: string[] = ["jsx", "tsx"]
) => {
  /**
   * 1. 解析代码 获取需要渲染的代码块和标题简介部分
   * 2. 对转换好的代码进行字符串化，并拼接好渲染的代码块(解析代码块的依赖，渲染的代码块不需要进行转换，只移出 import/require 引入)
   * 3. 添加渲染代码块的组件字符串
   * 4. 所有内容拼接成一个字符串
   * 5. 通过babel-loader 进行转换成模块
   * 6. 返回babel-loder 结果
   * 7. 页面渲染
   * ***/
};
