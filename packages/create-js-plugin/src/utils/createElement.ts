import {
  transformSymbol,
  isShowNode,
  getProperties,
  getIntervalStr,
  MarkDownHastNodeTreeType,
  StepOneReturn,
  OtherMapType,
} from ".";
// ---------------   拼接标签      -----------------
export const createElementStr = (
  item: MarkDownHastNodeTreeType,
  Ignore: StepOneReturn,
  isIgnore = false,
  newPreMap: Map<number, any> = new Map([]),
  otherMap: OtherMapType
) => {
  let code = "";
  if (item.type === "root") {
    code = loop(item.children, Ignore, isIgnore, newPreMap, otherMap);
  } else if (item.type === "element") {
    const result = loop(item.children, Ignore, isIgnore, newPreMap, otherMap);
    const TagName = item.tagName;
    const properties = getProperties(item.properties || {});
    const line =
      item && item.position && item.position.start && item.position.start.line;
    // 这个位置需要判断内容 判断是否是一个 pre 标签 ，子集是 code ，并且是 jsx 或 tsx 语言的需要替换成其他组件进行渲染效果
    if (
      typeof line === "number" &&
      Ignore.filesValue[line] &&
      TagName === "pre"
    ) {
      const { head, desc } = getIntervalStr(Ignore.ignoreRows, line, newPreMap);
      otherMap.set(line, {
        head,
        desc,
        code: result,
        copyNode: Ignore.filesValue[line].value,
      });
      code += `<Code 
      ${properties}
       copyNode={importCopyNodeRender["${line}"]} 
       desc={importDescRender["${line}"]}
       head={importHeadRender["${line}"]}
       code={importCodeRender["${line}"]}
      >{importBaseCodeRender["${line}"]&&importBaseCodeRender["${line}"]()}</Code>`;
    } else {
      code += `<${TagName} ${properties}>${result}</${TagName}>`;
    }
  } else if (item.type === "text") {
    code += `${transformSymbol(item.value)}`;
  }
  return {
    str: code,
    otherMap,
  };
};

export const loop = (
  child: MarkDownHastNodeTreeType[],
  Ignore: StepOneReturn,
  isIgnore: boolean | undefined,
  newPreMap: Map<number, any> = new Map([]),
  otherMap: OtherMapType
) => {
  let code = "";
  child.forEach((item, index) => {
    if (isIgnore && !isShowNode(Ignore.ignoreRows || [], index)) {
      // 这块需要记录转换后的代码，便于后面直接使用
      const { str } = createElementStr(
        item,
        Ignore,
        false,
        newPreMap,
        otherMap
      );
      if (str !== "\n") {
        newPreMap.set(index, str);
      }
    } else {
      const { str } = createElementStr(
        item,
        Ignore,
        false,
        newPreMap,
        otherMap
      );
      code += str;
    }
  });
  return code;
};
