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
  lang?: string;
  headTree?: any;
  descTree?: any;
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
  /** 标签转换的属性是否直接返回字符串形式还是直接输出文件的形式 **/
  isPropertiesString?: boolean;
  /** 是否需要解析代码块以上到标题之间的内容并合并到展示组件中 **/
  isInterval?: boolean;
  /** 是否是所属的行赋值还是数组下标进行赋值 ***/
  isLine?: boolean;
};
