/*
 * @Description: 处理标签属性
 */
import style from "style-to-object";

//  ---------------------- 替换 特殊符号 -------------------
export const SymbolMap = new Map([
  ["{", "&#123;"],
  ["}", "&#125;"],
  [">", "&gt;"],
  ["<", "&lt;"],
  ["=", "&#61;"],
  [">=", "&lt;&#61;"],
  ["<=", "&gt;&#61;"],
  ["\\", "&#92;"],
  ["</", "&lt;&#47;"],
  ["=>", "&#61;&gt;"],
  ["/>", "&#47;&gt;"],
]);
export const transformSymbol = (str: string) => {
  let newStr = "";
  str.split("").forEach((va) => {
    const nw = `${va}`.trim();
    if (SymbolMap.has(nw)) {
      newStr += SymbolMap.get(nw);
    } else {
      newStr += va;
    }
  });
  return newStr;
};

export const stringEscape = (str: string) => {
  let newStr = "";
  str.split("").forEach((itemStr) => {
    if (itemStr === "`") {
      newStr += `\\`;
    }
    newStr += itemStr;
  });
  return newStr;
};
export const transformStr = (str: string) => {
  const Rg = /-([a-z])/g;
  return str.replace(Rg, function ($0, $1) {
    return $1.toUpperCase();
  });
};
/** 字符串 style 转换成对象 */
export const styleIterator = (value: string) => {
  const output: Record<string, string> = {};
  const iterator = (name: string, itemValue: any) => {
    const k = name.slice(0, 4) === "-ms-" ? `ms-${name.slice(4)}` : name;
    const keys = transformStr(k);
    output[keys] = itemValue;
  };
  style(value, iterator);
  return output;
};

/**
 * @description: 标签属性 拼接字符串
 * @param {Record<string, unknown>} properties 属性对象
 * @return {string}
 */
export const getProperties = (properties: Record<string, unknown>): string => {
  let str = "";
  Object.entries(properties).forEach(([key, value]) => {
    let newKey = key;
    let newValue = value;
    if (newKey === "ariaHidden") {
      newKey = "aria-hidden";
    }

    if (newKey === "style" && typeof value === "string") {
      newValue = styleIterator(value);
    }

    if (newKey === "data-code") {
      str += ` ${newKey}={\`${stringEscape(newValue as string)}\`} `;
    } else if (typeof newValue === "function") {
      str += ` ${newKey}={${newValue.toString()}} `;
    } else if (Array.isArray(newValue)) {
      str += ` ${newKey}="${newValue.join(" ")}" `;
    } else if (Object.prototype.toString.call(newValue) === "[object Object]") {
      str += ` ${newKey}={${JSON.stringify(newValue)}} `;
    } else if (typeof newValue === "string") {
      str += ` ${newKey}={\`${newValue}\`}`;
    } else {
      str += ` ${newKey}={${newValue}} `;
    }
  });
  return str;
};
