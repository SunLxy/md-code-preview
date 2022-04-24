import FS from "fs-extra"
import path from "path"
import webpack from "webpack"
import chokidar from 'chokidar';
import { markdownParse, getFileDirName } from "./utils"

export interface MdCodePreviewPluginProps {
  /** 监听的根目录 默认：path.join(process.cwd(), "") */
  cwd?: string;
  /** 输入文件地址,默认: path.join(process.cwd(), "src/.docs") **/
  output?: string;
}

// 输出文件 默认路径去除根路径，其他的拼接起来当文件夹名称，每个文件夹下对应当前md文件所有的 代码块
class MdCodePreviewPlugin {
  // 1. 输出目录，
  // 2. 哪些文件排除不进行监听
  // 3. 监听的根目录
  // 4. 去除的根路径
  cwd: string = ''
  output: string = ""
  oldOut: Map<string, string> = new Map([])

  constructor(props: MdCodePreviewPluginProps = {}) {
    this.cwd = props.cwd || path.join(process.cwd(), "")
    this.output = props.output || path.join(process.cwd(), "src/.docs")
    this.getPathDeep(this.cwd)
  }

  readFile = (filePath: string) => {
    const fileUrl = path.join(this.cwd, filePath)
    const mdStr = FS.readFileSync(fileUrl, { encoding: "utf-8" })
    if (this.oldOut.has(filePath)) {
      if (this.oldOut.get(filePath) === mdStr) {
        return
      }
    }
    const fileDirName = getFileDirName(filePath, this.cwd)
    markdownParse(mdStr, fileDirName, this.output)
  }

  // 递归文件
  getPathDeep = (filePath: string, parent: string = '') => {
    const files = FS.readdirSync(filePath);
    if (files && !/node_modules/.test(filePath)) {
      files.forEach((filename: string) => {
        let child = parent === "" ? filename : `${parent}/${filename}`
        const filedir = path.join(filePath, filename);
        const isNoEmty = FS.existsSync(filedir);
        if (!isNoEmty) {
          return;
        }
        const stats = FS.statSync(filedir);
        if (stats) {
          const isFile = stats.isFile(); //是文件
          const isDir = stats.isDirectory(); //是文件夹
          if (isFile && /\.md$/.test(filename)) {
            this.readFile(child)
          }
          if (isDir && !/node_modules/.test(filePath)) {
            this.getPathDeep(filedir, child); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
          }
        }
      });
    }
  };

  apply(compiler: webpack.Compiler) {
    compiler.hooks.afterPlugins.tap('MdCodePreviewPlugin', () => {
      if (process.env.NODE_ENV === 'development') {
        chokidar.watch(["*.md", "*/**/*.md"], {
          cwd: this.cwd,
          ignored: /node_modules/,
        }).on("all", (event, path) => {
          this.readFile(path)
        })
      }
    })
  }
}
export default MdCodePreviewPlugin