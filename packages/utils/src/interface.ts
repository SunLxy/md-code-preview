export * from "md-unified-utils";
import { GetProcessorOptionsType } from ".";
export type StartAndEndType = {
  column: number;
  offset: number;
  line: number;
};

export type PositionType = {
  start: StartAndEndType;
  end: StartAndEndType;
};

export type IgnoreRows = {
  start: number;
  end: number;
};

export type FilesValueItemType = {
  value?: string;
  transform?: string;
  desc?: string;
  head?: string;
  code?: string;
  copyNode?: string;
  title?: string;
  lang?: string;
  dependencies?: {
    code?: string;
    deps?: DepsType;
    depNamespaces?: DepNamespacesType;
    depDirects?: DepNamespacesType;
    depsName?: string[];
  };
};

export type FilesValueType = Record<number, FilesValueItemType>;

export type StepOneReturn = {
  ignoreRows: IgnoreRows[];
  filesValue: FilesValueType;
};

export type MarkDownTreeType = {
  children: {
    lang: string;
    meta?: any;
    type: string;
    value: string;
    position: PositionType;
    children?: MarkDownTreeType["children"];
  }[];
  position: PositionType;
  type: string;
};

export type MarkDownHastNodeTreeType = {
  type: string;
  data?: Record<string, unknown>;
  tagName: string;
  properties: Record<string, unknown>;
  position: PositionType;
  value: string;
  children: MarkDownHastNodeTreeType[];
};

export type OtherProps = {
  /** 是否需要解析代码块以上到标题之间的内容并合并到展示组件中 **/
  isInterval?: boolean;
  /** 是否是所属的行赋值还是数组下标进行赋值 ***/
  isLine?: boolean;
  /** 是否需要传递依赖数据 **/
  isDeps?: boolean;
  /** 预览组件地址 **/
  mdCodePreviewPath?: string;
  options?: GetProcessorOptionsType;
  codePenOptions?: {
    /** 设置 codepen 需要的参数-- css 样式文件引用 **/
    css?: string;
    /** 设置 codepen 需要的参数--- 浏览器中预览需要的 umd 包 **/
    js?: string;
    /**设置 codepen 需要的参数--- 需要代码块中排除注释的包引用 **/
    includeModule?: string[];
  };
};

export type DepsType = Record<string, { default: string; other: string[] }>;
export type DepNamespacesType = Record<string, string>;

export interface GetConfigOptions {
  code?: string;
  title?: string;
  css?: string;
  js?: string;
  includeModule?: string[];
  dependencies?: string[];
}
