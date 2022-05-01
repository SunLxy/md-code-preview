import { lastReturn } from "./utils";
export { default as MdCodePreviewPlugin } from "./plugins";
export * from "./utils";

export default function (source: string) {
  const options = this.getOptions();
  const isInterval = Reflect.has(options || {}, "isInterval")
    ? Reflect.get(options || {}, "isInterval")
    : true;

  const results = lastReturn(source, options.lang || ["jsx", "tsx"], {
    isInterval,
  });
  return results;
}
