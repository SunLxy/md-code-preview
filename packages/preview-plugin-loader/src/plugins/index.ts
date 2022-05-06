import FS from "fs-extra";
import path from "path";
import webpack from "webpack";
import chokidar from "chokidar";
import { markdownParsePlugin } from "../utils";
import anymatch from "anymatch";
import {
  createPluginReturn,
  getFileDirName,
  GetProcessorOptionsType,
  OtherProps,
} from "md-plugin-loader-utils";

export interface MdCodePreviewPluginProps {
  /** 监听的根目录 默认：path.join(process.cwd(), "") */
  cwd?: string;
  /** 输入文件地址,默认: path.join(process.cwd(), "src/.docs") **/
  output?: string;
  /** 监听文件格式 可以参照 https://www.npmjs.com/package/chokidar   **/
  matchRules?: string | string[];
  /** 忽略监听文件规则  默认忽略 node_modules 下所有的文件 ***/
  ignored?: any;
  /** 文件夹前缀 **/
  pre?: string;
  /** 是否直接把markdown转换成react代码输出 **/
  createJs?: boolean;
  /***  以下参数为 markdown 转换工具需要的参数 ****/
  /** 需要转换预览的代码块语言 **/
  lang?: string[];
  /** 是否需要解析代码块以上到标题之间的内容并合并到展示组件中 **/
  isInterval?: boolean;
  /** 组件预览地址 默认 "md-code-preview" 包名称 **/
  mdCodePreviewPath?: string;
  /** markdown 转换代码 参数 ***/
  options?: GetProcessorOptionsType;
  /** codepen 配置参数 **/
  codePenOptions?: OtherProps["codePenOptions"];
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
  isInterval: boolean = true;
  mdCodePreviewPath = "md-code-preview";
  options: GetProcessorOptionsType = {};
  codePenOptions: OtherProps["codePenOptions"] = {};

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
    if (Reflect.has(props, "isInterval")) {
      this.isInterval = Reflect.get(props, "isInterval");
    }
    if (Reflect.has(props, "options")) {
      this.options = Reflect.get(props, "options") || {};
    }
    if (Reflect.has(props, "mdCodePreviewPath") && props.mdCodePreviewPath) {
      this.mdCodePreviewPath = Reflect.get(props, "mdCodePreviewPath");
    }
    if (Reflect.has(props, "codePenOptions") && props.codePenOptions) {
      this.codePenOptions = Reflect.get(props, "codePenOptions");
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
        const result = createPluginReturn(mdStr, this.lang, {
          isInterval: this.isInterval,
          mdCodePreviewPath: this.mdCodePreviewPath,
          options: this.options,
          codePenOptions: this.codePenOptions,
        });
        Object.entries(result).forEach(([key, value]) => {
          if (value) {
            FS.writeFileSync(`${outDir}/${key}.js`, value as string, {
              encoding: "utf8",
              flag: "w+",
            });
          }
        });
      } else {
        const initStr = markdownParsePlugin(
          mdStr,
          fileDirNames,
          this.output,
          this.lang,
          this.isInterval,
          this.mdCodePreviewPath,
          this.options,
          this.codePenOptions
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
