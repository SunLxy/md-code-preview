/*
 * @Description: 拼接标签
 */
import { transformSymbol, getProperties, MarkDownHastNodeTreeType } from ".";
/**
 * @description: 拼接标签
 * @param {MarkDownHastNodeTreeType} item 解析后的dom数据
 */
export const createElementStr = (item: MarkDownHastNodeTreeType) => {
  let code = "";
  if (item.type === "root") {
    code = loop(item.children);
  } else if (item.type === "element") {
    const result = loop(item.children);
    const TagName = item.tagName;
    const properties = getProperties(item.properties || {});
    code += `<${TagName} ${properties}>${result}</${TagName}>`;
  } else if (item.type === "text" && item.value !== "\n") {
    code += `${transformSymbol(item.value)}`;
  }
  return code;
};

export const loop = (child: MarkDownHastNodeTreeType[]) => {
  let code = "";
  child.forEach((item) => {
    code += createElementStr(item);
  });
  return code;
};
