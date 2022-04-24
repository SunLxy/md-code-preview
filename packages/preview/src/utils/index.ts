import unified from "unified"
import remarkParse from "remark-parse"
import FS from "fs-extra"
import path from "path"
type StartAndEndType = {
  column: number,
  offset: number,
  line: number,
}

type PositionType = {
  start: StartAndEndType,
  end: StartAndEndType
}


type MarkdownTreeType = {
  children: {
    lang: string,
    meta: any,
    type: string,
    value: string,
    position: PositionType
  }[],
  position: PositionType,
  type: string
}

// @ts-ignore
export const getMD = (str: string) => unified().use(remarkParse).parse(str)
// 解析文件 对文件内容进行区分生成临时文件，用于显示组件

export const getFileDirName = (resourcePath: string, rootContext: string) => {
  return resourcePath.replace(rootContext, "").split(/\/|\\/).join("").replace(/.md$/, "")
}

export const markdownParse = (source: string, fileDirName: string, savePath: string) => {
  const dirPath = path.join(savePath, fileDirName)
  // 置空文件夹
  FS.emptyDirSync(dirPath)
  const markdownTree = getMD(source) as MarkdownTreeType
  const files: Record<number, string> = {}
  const filesValue: Record<number, { filename: string, value: string, path: string }> = {}

  markdownTree.children.map((itemChild) => {
    if (itemChild && itemChild.type === "code" && ["jsx", "tsx"].includes(itemChild.lang)) {
      const line = itemChild.position.start.line
      const filename = `${line}.${itemChild.lang}`
      FS.writeFileSync(`${dirPath}/${filename}`, itemChild.value, { flag: "w+", encoding: "utf-8" })
      files[line] = filename
      filesValue[line] = {
        filename,
        value: itemChild.value,
        path: `${dirPath}/${filename}`
      }
    }
  })
  return {
    files,
    filesValue
  }
}
