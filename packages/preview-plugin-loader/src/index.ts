import { markdownParse, } from "./utils"
export { default as MdCodePreviewPlugin } from "./plugin"
export * from "./utils"

export default function (source: string) {
  const options = this.getOptions()
  const filesValue = markdownParse(source, options.lang || ["jsx", "tsx"])
  return {
    source,
    filesValue,
  }
}