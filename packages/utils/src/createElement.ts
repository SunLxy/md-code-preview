import { transformSymbol, getProperties, MarkDownHastNodeTreeType } from ".";
// ---------------   拼接标签      -----------------
export const createElementStr = (
  item: MarkDownHastNodeTreeType,
  isAllString: boolean = false
) => {
  let code = "";
  if (item.type === "root") {
    code = loop(item.children, isAllString);
  } else if (item.type === "element") {
    const result = loop(item.children, isAllString);
    const TagName = item.tagName;
    const properties = getProperties(item.properties || {}, isAllString);
    code += `<${TagName} ${properties}>${result}</${TagName}>`;
  } else if (item.type === "text") {
    code += `${transformSymbol(item.value)}`;
  }
  return code;
};

export const loop = (
  child: MarkDownHastNodeTreeType[],
  isAllString: boolean = false
) => {
  let code = "";
  child.forEach((item) => {
    code += createElementStr(item, isAllString);
  });
  return code;
};
