import { transformSymbol, getProperties, MarkDownHastNodeTreeType } from ".";
/**
 * @description: 拼接标签
 * @param {MarkDownHastNodeTreeType} item 解析后的dom数据
 * @param {boolean} isPropertiesString 标签转换的属性是否直接返回字符串形式还是直接输出文件的形式
 */
export const createElementStr = (
  item: MarkDownHastNodeTreeType,
  isPropertiesString: boolean = false
) => {
  let code = "";
  if (item.type === "root") {
    code = loop(item.children, isPropertiesString);
  } else if (item.type === "element") {
    const result = loop(item.children, isPropertiesString);
    const TagName = item.tagName;
    const properties = getProperties(item.properties || {}, isPropertiesString);
    code += `<${TagName} ${properties}>${result}</${TagName}>`;
  } else if (item.type === "text" && item.value !== "\n") {
    code += `${transformSymbol(item.value)}`;
  }
  return code;
};

export const loop = (
  child: MarkDownHastNodeTreeType[],
  isPropertiesString: boolean = false
) => {
  let code = "";
  child.forEach((item) => {
    code += createElementStr(item, isPropertiesString);
  });
  return code;
};
