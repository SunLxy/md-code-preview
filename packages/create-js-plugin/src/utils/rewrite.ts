import { Root, Element, ElementContent } from "hast";
import { getCodeString } from "rehype-rewrite";
import { octiconLink } from "./nodes/octiconLink";
import { copyElement } from "./nodes/copy";

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
