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
