# markdown 文件字符串转换标签树

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

用于转换读取的`markdown`字符串,转换成标签类型树

```ts
const processor = getProcessor();
// scope 是 markdown字符串
const { file, child } = transformMarkdown(scope, processor);
```
