# markdown 文件转换工具

**getProcessor**

返回一个`Processor`，用于转换读取的`markdown`字符串

```ts
type GetProcessorOptionsType = {
  rehypePlugins?: PluggableList;
  remarkPlugins?: PluggableList;
  remarkRehypeOptions?: Options;
};

const processor = getProcessor();
const file: any = new VFile();
file.value = scope;
const child = processor.parse(file);
```

**transformMarkdown**

用于转换读取的`markdown`字符串

```ts
const processor = getProcessor();
// scope 是 markdown字符串
const { file, child } = transformMarkdown(scope, processor);
```

**getIntervalData**

解析代码块以上到标题之间的内容并合并到展示组件中

```ts
/**
 * @description: 解析代码块以上到标题之间的内容并合并到展示组件中
 * @param {number} endIndex 当前数组的下标
 * @param {MarkDownTreeType["children"]} child 通过解析的markdown数据
 * @param {boolean} isLine  是否是所属的行赋值还是数组下标进行赋值
 */
const { start, end, desc, head } = getIntervalData(endIndex, child, isLine);
/**
 * start 开始位置
 * end 结束位置
 * desc 简介部分
 * head 标题
 * **/
```

**isShowNode**

判断是否需要展示

```ts
/**
 * @description: 判断是否需要展示
 * @param {IgnoreRows} ignoreRows 忽略的对象
 * @param {number} index 当前位置下标
 * @return {boolean}
 */
const isshow = isShowNode(ignoreRows, index);
```

**transformSymbol**

替换 特殊符号

```ts
/**
 * @description: 替换 特殊符号
 * @param {string} str 字符串
 * @return {string}
 */
const result = transformSymbol("/>");
```

**getProperties**

标签属性 拼接字符串

```ts
/**
 * @description: 标签属性 拼接字符串
 * @param {Record<string, unknown>} properties 属性对象
 * @return {string}
 */
const result = getProperties(
  { className: "ads", style: { color: "red" } },
  false
);
```

**getFileDirName**

获取文件夹名称

```ts
/**
 * @description: 获取文件夹名称
 * @param {string} resourcePath  文件的绝对路径
 * @param {string} rootContext 项目的根目录绝对路径
 */
const result = getFileDirName(
  "/user/dom/a/packages/utils/README.md",
  "/user/dom/a"
);
/** 返回  ----> /packages/utils/README.md */
```

**createElementStr**

拼接标签

```ts
/**
 * @description: 拼接标签
 * @param {MarkDownHastNodeTreeType} item 解析后的dom数据
 */

const result = createElementStr(item);
```

**createStr**

创建最后输出的字符串

```ts
/**
 * @description:  创建最后输出的字符串
 * @param {FilesValueType} otherObj markdown字符串
 * @param {string} indexStrs 主体代码
 * @param {boolean} isInterval 是否需要查找代码块以上到标题之间的内容并合并到渲染组件内
 */
const result = createStr(filesValue, "<div>测试代码</div>");
```

**babelTransform**

代码转换

```ts
const result = babelTransform(
  `import React from "react";\n export default ()=>{return <div>测试</div>}`,
  "filename.js"
);
```

**getTransformValue**

通过`babelTransform`转换代码，再次进行转换，变成一个变量的形式

```ts
const result = getTransformValue(
  `import React from "react";\n export default ()=>{return <div>测试</div>}`,
  "filename.js"
);
```

**createPluginReturn**

最终的返回内容(适合 plugin 形式，直接生成文件)

```ts
/**
 * @description:  最终的返回内容
 * @param {string} scope markdown字符串
 * @param {string} lang 解析代码块的语言
 * @param {OtherProps} otherProps 其他参数
 */
const lastReturn = ("最终的返回内容", ["jsx", "tsx"], {});
```
