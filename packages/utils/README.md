# markdown 文件转换工具

## 主要方法

**createPluginReturn**

`plugin`里面使用时最终的返回内容

```ts
/**
 * @description:  最终的返回内容
 * @param {string} scope markdown字符串
 * @param {string} lang 解析代码块的语言
 * @param {OtherProps} otherProps 其他参数
 */
const result = createPluginReturn("markdown 内容", ["tsx"], {});

/**返回字段
 *   importCodeRender: string
 *   importHeadRender: string
 *   importDescRender: string
 *   importCopyNodeRender: string
 *   importBaseCodeRender: string
 *   index: string
 * */
```

**createLoaderRetuen**

`loader`使用，最终的返回内容

```ts
/**
 * @description:  最终的返回内容
 * @param {string} scope markdown字符串
 * @param {string} lang 解析代码块的语言
 * @param {OtherProps} otherProps 其他参数
 */
const result = createLoaderRetuen("markdown 内容", ["tsx"], {});

/**返回结果类型 string  **/
```

**getProcessor**

返回一个`Processor`，用于转换读取的`markdown`字符串

```ts
type GetProcessorOptionsType = {
  rehypePlugins?: PluggableList;
  remarkPlugins?: PluggableList;
  remarkRehypeOptions?: Options;
};
type processor = (v?: GetProcessorOptionsType) => Processor;

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

**newStepOne**

根据 `child.children` 找到 `code` 代码块及其上面到 head 之间的位置

```ts
/**
 * @description: 根据  child.children 找到 code 代码块及其上面到head之间的位置
 * @param {MarkDownTreeType["children"]} child 通过解析的markdown数据
 * @param {string[]} lang 解析代码块的语言
 * @param {MarkDownHastNodeTreeType[]} hastChild 解析转换后的标签树
 * @param {OtherProps} otherProps  其他参数
 */
  const processor = getProcessor({});
  const { child, file } = transformMarkdown(scope, processor);
  const hastChild = processor.runSync(child, file) as MarkDownHastNodeTreeType;
  const {ignoreRows，filesValue} = newStepOne(child.children, lang, hastChild.children,{});
/** 返回结果
 *  ignoreRows: IgnoreRows[] 忽略数据;
 *  filesValue: FilesValueType 行对应的代码数据;
 * */

```

**newStepTwoTree**

解析转换后的标签树，进行标签拼接字符串

```ts
/**
 * @description: 解析转换后的标签树，进行标签拼接字符串
 * @param {MarkDownHastNodeTreeType[]} hastChild 解析转换后的标签树
 * @param {IgnoreRows[]} ignoreRows 忽略的数据
 * @param {StepOneReturn["filesValue"]} filesValue 行对应的代码数据
 * @param {OtherProps} otherProps  其他参数
 */

const processor = getProcessor({});
const { child, file } = transformMarkdown(scope, processor);
const hastChild = processor.runSync(child, file) as MarkDownHastNodeTreeType;
const One = newStepOne(child.children, lang, hastChild.children, {});
const { filesValue, indexStr } = newStepTwoTree(
  hastChild.children,
  One.ignoreRows,
  One.filesValue,
  {}
);
/** 返回结果
 *  indexStr: string 主体代码字符串;
 *  filesValue: FilesValueType 行对应的代码数据;
 * */
```

## 其他方法

**createDepsStr**

拼接依赖字符串

**createOtherStr**

拼接标题/简介/复制 code/code 渲染/渲染组件的名称 字符串

**splicingString**

`loader`最终返回使用，拼接整个最终返回的代码字符串

**createBaseCodeRenderStr**

拼接代码块预览字符串

**createStr**

`plugin`最终返回使用，拼接整个最终返回的代码字符串

**getProperties**

把所有属性对象转换成字符串

**createElementStr**

拼接标签字符串

**transformCode**

使用 babel 进行代码块解析，获取使用`import`引用的依赖包和名称

**getTransformValue**

根据代码块解析，并返回解析后的代码字符串，进行替换拼接成一个方法，
