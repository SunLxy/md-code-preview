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
  line: number;
};

export type FilesValueType = Record<
  number,
  {
    value: string;
    transform: string;
  }
>;

export type StepOneReturn = {
  ignoreRows: IgnoreRows[];
  filesValue: FilesValueType;
};

export type OtherMapType = Map<
  number,
  { head: string; desc: string; code: string; copyNode: string }
>;

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
