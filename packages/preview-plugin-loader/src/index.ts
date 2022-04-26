import { markdownParse } from "./utils";
export { default as MdCodePreviewPlugin } from "./plugins/pull-code";
export { default as MdCreateComponentsPlugin } from "./plugins/create-component";
export * from "./utils";

export default function (source: string) {
  const options = this.getOptions();
  const { filesValue, ignoreRows } = markdownParse(
    source,
    options.lang || ["jsx", "tsx"]
  );
  return {
    source,
    filesValue,
    ignoreRows,
  };
}
