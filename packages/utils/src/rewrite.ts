import { Root, Element, ElementContent } from "hast";
import { getCodeString } from "rehype-rewrite";
import { octiconLink } from "./nodes/octiconLink";
import { copyElement } from "./nodes/copy";

/**
 * 直接使用的 `@uiw/react-markdown-preview`里面的 (https://github.com/uiwjs/react-markdown-preview/blob/ab0be5546df8d17929a75041b15440c9c32c1969/src/index.tsx#L16-L29)
 * **/

export const rehypeRewriteHandle = (
  node: ElementContent,
  index: number | null,
  parent: Root | Element | null
) => {
  if (
    node.type === "element" &&
    parent &&
    parent.type === "root" &&
    /h(1|2|3|4|5|6)/.test(node.tagName)
  ) {
    const child = node.children && (node.children[0] as Element);
    if (child && child.properties && child.properties.ariaHidden === "true") {
      child.properties = { className: "anchor", ...child.properties };
      child.children = [octiconLink];
    }
  }
  if (node.type === "element" && node.tagName === "pre") {
    const code = getCodeString(node.children);
    node.children.push(copyElement(code));
  }
};
