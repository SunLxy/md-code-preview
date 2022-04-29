import { markdownParse } from "./utils";
export { default as MdCodePreviewPlugin } from "./plugins";
export * from "./utils";

export default function (source: string) {
  const options = this.getOptions();
  const isInterval = Reflect.has(options || {}, "isInterval")
    ? Reflect.get(options || {}, "isInterval")
    : true;
  const { filesValue, ignoreRows } = markdownParse(
    source,
    options.lang || ["jsx", "tsx"],
    isInterval
  );
  return {
    source,
    filesValue,
    ignoreRows,
  };
}
