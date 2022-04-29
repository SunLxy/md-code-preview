import FS from "fs-extra";
import path from "path";
import webpack from "webpack";
import chokidar from "chokidar";
import { markdownParsePlugin } from "../utils";
import anymatch from "anymatch";
import { lastReturn, getFileDirName } from "md-plugin-utils";

export interface MdCodePreviewPluginProps {
  /** 监听的根目录 默认：path.join(process.cwd(), "") */
  cwd?: string;
  /** 输入文件地址,默认: path.join(process.cwd(), "src/.docs") **/
  output?: string;
  /** 监听文件格式 可以参照 https://www.npmjs.com/package/chokidar   **/
  matchRules?: string | string[];
  /** 忽略监听文件规则  默认忽略 node_modules 下所有的文件 ***/
  ignored?: any;
  // 语言
  lang?: string[];
  /** 文件夹前缀 **/
  pre?: string;
  /** 是否直接把markdown转换成react代码输出 **/
  createJs?: boolean;
}

// 输出文件 默认路径去除根路径，其他的拼接起来当文件夹名称，每个文件夹下对应当前md文件所有的 代码块
class MdCodePreviewPlugin {
  // 1. 输出目录，
  // 2. 哪些文件排除不进行监听
  // 3. 监听的根目录
  // 4. 去除的根路径
  cwd: string = "";
  output: string = "";
  oldOut: Map<string, string> = new Map([]);
  ignored: any = [/node_modules/];
  matchRules: string[] = ["*.md", "*/**/*.md"];
  lang: string[] = ["jsx", "tsx"];
  pre: string = "";
  createJs: boolean = true;

  constructor(props: MdCodePreviewPluginProps = {}) {
    this.cwd = props.cwd || path.join(process.cwd(), "");
    this.output = props.output || path.join(process.cwd(), "src/.docs");
    if (props.ignored) {
      if (Array.isArray(props.ignored)) {
        this.ignored = this.ignored.concat(props.ignored);
      } else {
        this.ignored = this.ignored.concat([props.ignored]);
      }
    }
    if (props.matchRules) {
      if (Array.isArray(props.matchRules)) {
        this.matchRules = this.matchRules.concat(props.matchRules);
      } else {
        this.matchRules = this.ignored.concat([props.matchRules]);
      }
    }
    if (props.lang) {
      if (Array.isArray(props.lang)) {
        this.lang = props.lang;
      }
    }
    if (props.pre) {
      this.pre = `${props.pre}-`;
    }
    if (Reflect.has(props, "createJs")) {
      this.createJs = Reflect.get(props, "createJs");
    }
    this.getPathDeep(this.cwd);
  }

  readFile = (filePath: string) => {
    const fileUrl = path.join(this.cwd, filePath);
    const mdStr = FS.readFileSync(fileUrl, { encoding: "utf-8" });
    if (this.oldOut.has(filePath)) {
      if (this.oldOut.get(filePath) === mdStr) {
        return;
      }
    }
    const fileDirName = getFileDirName(filePath, this.cwd);
    const fileDirNames = `${this.pre}${fileDirName}`;
    const outDir = path.join(this.output, `${this.pre}${fileDirName}`);

    FS.emptyDirSync(outDir);
    if (mdStr.trim()) {
      if (this.createJs) {
        const result = lastReturn(mdStr, this.lang);
        Object.entries(result).forEach(([key, value]) => {
          FS.writeFileSync(`${outDir}/${key}.js`, value as string, {
            encoding: "utf8",
            flag: "w+",
          });
        });
      } else {
        const initStr = markdownParsePlugin(
          mdStr,
          fileDirNames,
          this.output,
          this.lang
        );
        if (initStr) {
          const dirPath = path.join(this.output, fileDirNames);
          FS.writeFileSync(
            `${dirPath}/assets.js`,
            `import React from "react";\nexport default {${initStr}}`,
            { flag: "w+", encoding: "utf-8" }
          );
        }
      }
    }
  };

  private getIgnored = (filePath: string) => {
    const paths = filePath.replace(/\/|\\/g, "/");
    return anymatch(this.ignored, paths);
  };

  // 递归文件
  getPathDeep = (filePath: string, parent: string = "") => {
    const files = FS.readdirSync(filePath);
    if (files && !this.getIgnored(filePath)) {
      files.forEach((filename: string) => {
        let child = parent === "" ? filename : `${parent}/${filename}`;
        const filedir = path.join(filePath, filename);
        const isNoEmty = FS.existsSync(filedir);
        if (!isNoEmty) {
          return;
        }
        if (this.getIgnored(child)) {
          return;
        }
        const stats = FS.statSync(filedir);
        if (stats) {
          const isFile = stats.isFile(); //是文件
          const isDir = stats.isDirectory(); //是文件夹
          if (isFile && /\.md$/.test(filename)) {
            this.readFile(child);
          }
          if (isDir) {
            this.getPathDeep(filedir, child); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
          }
        }
      });
    }
  };

  apply(compiler: webpack.Compiler) {
    compiler.hooks.afterPlugins.tap(
      this.createJs ? "MdCodeCreateJsPlugin" : "MdCodePreviewPlugin",
      () => {
        if (process.env.NODE_ENV === "development") {
          chokidar
            .watch(this.matchRules, {
              cwd: this.cwd,
              ignored: this.ignored,
            })
            .on("all", (event, path) => {
              this.readFile(path);
            });
        }
      }
    );
  }
}
export default MdCodePreviewPlugin;