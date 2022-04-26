import React from "react";

export interface RenderProps {
  previewBodyClassName?: string;
  /**
   * 进行转换后的代码
   * 注意：不与 getComponent 一起使用，当传递`getComponent`时，直接使用 getComponent 返回展示，transform不做处理
   *  **/
  transform?: string;
  /**
   *  渲染依赖
   * 当只使用 `transform` 转换的代码展示时使用
   * **/
  dependencies?: Record<string, any>;
  /**
   * 通过 import() 的方式引入组件，可以直接返回一个组件
   * **/
  getComponent?: () =>
    | Promise<{ default: React.ComponentType<any> }>
    | React.ReactNode;
}

export type CommentsType = {
  title?: string;
  description?: string;
  [k: string]: string;
};

export type StartAndEndType = {
  column: number;
  offset: number;
  line: number;
};

export type PositionType = {
  start: StartAndEndType;
  end: StartAndEndType;
};

export type Node = {
  children: Node[];
  position: PositionType;
  tagName: string;
  type: string;
  value: string;
  properties: { className: string[]; [k: string]: unknown };
};

export interface CodeProps {
  /** 原始 代码块 渲染**/
  code?: React.ReactNode;
  /** 解析出的注释内容 **/
  comments?: CommentsType;
  /** 解析出来的 node 对象 **/
  node?: Node | Node[];
}

export interface PreviewProps extends RenderProps, CodeProps {
  className?: string;
}
