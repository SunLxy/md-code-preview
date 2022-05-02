/*
 * @Description: 拼接标签
 */
import { transformSymbol, getProperties, MarkDownHastNodeTreeType } from ".";
/**
 * @description: 拼接标签
 * @param {MarkDownHastNodeTreeType} item 解析后的dom数据
 */
export const createElementStr = (
  item: MarkDownHastNodeTreeType,
  isPre: number = undefined
) => {
  let code = "";
  if (item && item.type === "root") {
    code = loop(item.children, isPre);
  } else if (item && item.type === "element") {
    const result = loop(item.children, isPre);
    const TagName = item.tagName;
    const propertie = item.properties || {};
    const propertiesObj =
      isPre === 2 && TagName === "code"
        ? { className: propertie.className }
        : propertie;
    const newProperties = getProperties(propertiesObj);
    code += `<${TagName} ${newProperties}>${result}</${TagName}>`;
  } else if (item && item.type === "text" && item.value !== "\n") {
    code += `${transformSymbol(item.value)}`;
  }
  return code;
};

export const loop = (
  child: MarkDownHastNodeTreeType[],
  isPre: number = undefined
) => {
  let code = "";
  child.forEach((item) => {
    code += createElementStr(item, isPre !== undefined ? isPre + 1 : undefined);
  });
  return code;
};
