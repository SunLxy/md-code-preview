# 解析 markdown 引入,输出 react 代码字符串

1. loader
2. plugin

## loader

当前`loader`直接返回的相当于直接书写的`react`代码字符串，
如果需要渲染，需要使用`babel-loader`再次进行转换
可以直接使用`mdCodeModulesLoader`方法直接进行`webpack`配置修改

```ts
// .kktrc.ts
import { mdCodeModulesLoader } from "md-react-plugin-loader";

export default (conf, env, options) => {
  conf = mdCodeModulesLoader(conf);
  return conf;
};
```

## plugin

通过传递的绝对路径，直接检索目录下所有的`markdown`文件进行生成对应的`react`代码

1. 第一种：只抽离需要预览的代码块生成`react`代码文件，这种需要借助第三方预览工具
2. 第二种：直接把整个`markdown`转换成`react`代码文件

通过`createJs`参数控制第一种还是第二种

```ts
// 参数
export interface MdCodePreviewPluginProps {
  /** 监听的根目录 默认：path.join(process.cwd(), "") */
  cwd?: string;
  /** 输入文件地址,默认: path.join(process.cwd(), "src/.docs") **/
  output?: string;
  /** 监听文件格式 可以参照 https://www.npmjs.com/package/chokidar   **/
  matchRules?: string | string[];
  /** 忽略监听文件规则  默认忽略 node_modules 下所有的文件 ***/
  ignored?: any;
  /** 需要转换预览的代码块语言 **/
  lang?: string[];
  /** 文件夹前缀 **/
  pre?: string;
  /** 是否直接把markdown转换成react代码输出 **/
  createJs?: boolean;
  /** 是否需要解析代码块以上到标题之间的内容并合并到展示组件中 **/
  isInterval?: boolean;
}

// ------ .kktrc.ts  ------
import lessModules from "@kkt/less-modules";
import rawModules from "@kkt/raw-modules";
import path from "path";
import {
  MdCodePreviewPlugin,
  mdCodeModulesLoader,
} from "md-code-preview-plugin-loader";

export default (conf, env, options) => {
  conf = rawModules(conf, env, options);
  conf = lessModules(conf, env, options);
  conf.plugins.push(
    /** 第一种 **/
    new MdCodePreviewPlugin({
      cwd: path.join(process.cwd(), ".."),
      pre: "code",
      createJs: false,
      isInterval: false,
    }),
    /** 第二种 **/
    new MdCodePreviewPlugin({
      cwd: path.join(process.cwd(), ".."),
    })
  );

  conf.resolve = {
    ...conf.resolve,
    alias: {
      ...(conf.resolve.alias || {}),
      "@@": path.resolve(process.cwd(), "src/.docs"),
      "@": path.resolve(process.cwd(), "src"),
    },
  };
  return conf;
};
```
