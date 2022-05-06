import { lastReturn } from "./utils";
export { default as MdCodePreviewPlugin } from "./plugins";
export * from "./utils";

export default function (source: string) {
  const options = this.getOptions();
  const isInterval = Reflect.has(options || {}, "isInterval")
    ? Reflect.get(options || {}, "isInterval")
    : true;
  const mdCodePreviewPath = Reflect.has(options || {}, "mdCodePreviewPath")
    ? Reflect.get(options || {}, "mdCodePreviewPath")
    : "md-code-preview";
  const codePenOptions = Reflect.has(options || {}, "codePenOptions")
    ? Reflect.get(options || {}, "codePenOptions")
    : {};
  const results = lastReturn(source, options.lang || ["jsx", "tsx"], {
    isInterval,
    mdCodePreviewPath,
    codePenOptions,
  });
  return results;
}
