import { PluggableList } from "unified";
import { Options } from "remark-rehype";
export type StartAndEndType = {
  column: number;
  offset: number;
  line: number;
};

export type PositionType = {
  start: StartAndEndType;
  end: StartAndEndType;
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

export type GetProcessorOptionsType = {
  rehypePlugins?: PluggableList;
  remarkPlugins?: PluggableList;
  remarkRehypeOptions?: Options;
};
