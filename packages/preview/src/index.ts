import { markdownParse, getFileDirName, getMD } from "./utils"
export { default as MdCodePreviewPlugin } from "./plugin"
export {
  markdownParse,
  getFileDirName,
  getMD,
}

export default function (source: string) {
  const options = this.getOptions()
  const fileDirName = getFileDirName(this.resourcePath, this.rootContext)
  const { files, filesValue } = markdownParse(source, fileDirName, options.path)

  return {
    source,
    files,
    filesValue,
    fileDirName
  }
}