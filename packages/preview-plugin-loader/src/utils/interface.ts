export type StartAndEndType = {
  column: number;
  offset: number;
  line: number;
};

export type PositionType = {
  start: StartAndEndType;
  end: StartAndEndType;
};

export type MarkdownTreeType = {
  children: {
    lang: string;
    meta: any;
    type: string;
    value: string;
    position: PositionType;
    children?: MarkdownTreeType[];
  }[];
  position: PositionType;
  type: string;
};

export type FilesValueType = {
  filename?: string;
  value?: string;
  path?: string;
  transform?: string;
  comments?: CommentsType;
  head?: string;
  description?: string;
};

export type CommentsType = {
  title?: string;
  description?: string;
  [k: string]: string;
};